
from fastapi import FastAPI

from app.routers import salary, identity, search, stats, vote

app = FastAPI(title="BFF Service")

app.include_router(salary.router, prefix="/api/salaries", tags=["salaries"])
app.include_router(identity.router, prefix="/api/auth", tags=["auth"])
app.include_router(search.router, prefix="/api/search", tags=["search"])   
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])       
app.include_router(vote.router, prefix="/api/votes", tags=["votes"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}
