from fastapi import FastAPI
from app.routers import search

app = FastAPI(title="Search Service")
app.include_router(search.router, prefix="/api/search", tags=["search"])

@app.get("/health")
def health():
    return {"status": "healthy"}