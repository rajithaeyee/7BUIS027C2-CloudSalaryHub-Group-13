from fastapi import FastAPI

from app.routers import submission

app = FastAPI(title="Salary Submission Service")

app.include_router(submission.router, prefix="/api/submissions", tags=["submissions"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}