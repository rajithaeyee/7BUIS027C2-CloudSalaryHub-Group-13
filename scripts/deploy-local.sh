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

# echo "Building and pushing images to Docker Hub (${DOCKERHUB_USER}/*:${TAG})..."
# for entry in "${SERVICES[@]}"; do
#   IFS=':' read -r name dockerfile context <<< "$entry"
#   IMAGE="${DOCKERHUB_USER}/cloudsalaryhub-${name}:${TAG}"
#   echo "  -> ${IMAGE}"
#   docker build -f "$dockerfile" -t "$IMAGE" "$context"
#   docker push "$IMAGE"
# done

echo ""
echo "Applying namespaces..."
microk8s kubectl apply -f k8s/namespace.yaml
microk8s kubectl wait --for=jsonpath='{.status.phase}=Active' namespace/app  --timeout=30s
microk8s kubectl wait --for=jsonpath='{.status.phase}=Active' namespace/data --timeout=30s

echo ""
echo "Applying remaining manifests..."
microk8s kubectl apply -f k8s/

echo ""
echo "Restarting app-namespace deployments to pick up new image digests..."
microk8s kubectl -n app rollout restart deployment

echo ""
echo "Waiting for rollouts..."
microk8s kubectl -n app  rollout status deployment  --timeout=180s 2>/dev/null || true
microk8s kubectl -n data rollout status statefulset --timeout=180s 2>/dev/null || true

echo ""
echo "--- app namespace ---"
microk8s kubectl -n app  get pods,svc,ingress
echo ""
echo "--- data namespace ---"
microk8s kubectl -n data get pods,svc,pvc

echo ""
echo "Completed"
echo ""
