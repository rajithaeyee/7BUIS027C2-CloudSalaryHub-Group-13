#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

DOCKERHUB_USER="rajithaeyee"
TAG="${TAG:-latest}"

SERVICES=(
  "identity-service:identity-service/Dockerfile:."
  "salary-submission-service:salary-submission-service/Dockerfile:."
  "search-service:search-service/Dockerfile:."
  "stat-service:stat-service/Dockerfile:."
  "vote-service:vote-service/Dockerfile:."
  "bff-service:bff-service/Dockerfile:."
  "frontend:frontend/Dockerfile:./frontend"
)

echo "Building and pushing images to Docker Hub (${DOCKERHUB_USER}/*:${TAG})..."
for entry in "${SERVICES[@]}"; do
  IFS=':' read -r name dockerfile context <<< "$entry"
  IMAGE="${DOCKERHUB_USER}/cloudsalaryhub-${name}:${TAG}"
  echo "  -> ${IMAGE}"
  docker build -f "$dockerfile" -t "$IMAGE" "$context"
  docker push "$IMAGE"
done

echo ""
echo "Applying manifests..."
kubectl apply -f k8s/namespace.yaml
kubectl wait --for=jsonpath='{.status.phase}=Active' namespace/cloudsalaryhub --timeout=30s
kubectl apply -f k8s/
kubectl -n cloudsalaryhub rollout restart deployment

echo ""
echo "Waiting for rollout..."
kubectl -n cloudsalaryhub rollout status deployment --timeout=180s 2>/dev/null || true
kubectl -n cloudsalaryhub get pods

echo ""
echo "Completed"
echo ""

