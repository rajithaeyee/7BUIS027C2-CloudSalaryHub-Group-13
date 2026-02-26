from fastapi import FastAPI
from app.routers import stats

app = FastAPI(title="Stats Service")
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])

@app.get("/health")
def health():
    return {"status": "healthy"}