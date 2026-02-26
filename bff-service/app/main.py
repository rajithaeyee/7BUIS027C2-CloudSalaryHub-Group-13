
from fastapi import FastAPI

from app.routers import salary, identity

app = FastAPI(title="BFF Service")

app.include_router(salary.router, prefix="/api/salaries", tags=["salaries"])
app.include_router(identity.router, prefix="/api/auth", tags=["auth"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}
