from fastapi import FastAPI

from app.routers import auth
from shared.database import engine, Base
import shared.models  # noqa: F401 — ensures all models are registered before create_all

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Identity Service")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}