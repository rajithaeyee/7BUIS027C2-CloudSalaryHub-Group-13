
FROM python:3.13-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY shared/ /shared/

COPY stat-service/pyproject.toml stat-service/uv.lock ./

RUN uv sync --frozen --no-dev

COPY stat-service/app ./app

FROM python:3.13-slim

WORKDIR /app

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/app /app/app
COPY --from=builder /shared /shared

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8004

USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8004"]