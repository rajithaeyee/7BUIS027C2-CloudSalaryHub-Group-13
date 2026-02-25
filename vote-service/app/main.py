from fastapi import FastAPI
from app.routers import votes

app = FastAPI(title="Vote Service")
app.include_router(votes.router, prefix="/api/votes", tags=["votes"])

@app.get("/health")
def health():
    return {"status": "healthy"}