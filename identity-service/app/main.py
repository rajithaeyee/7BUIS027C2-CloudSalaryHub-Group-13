from fastapi import FastAPI

from app.routers import auth

app = FastAPI(title="Identity Service")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}