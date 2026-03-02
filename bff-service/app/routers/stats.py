from fastapi import APIRouter, HTTPException, Query
import httpx
from typing import Optional

from app.config import settings

router = APIRouter()

@router.get("/")
async def get_stats(
    country: Optional[str] = Query(None),
    role: Optional[str] = Query(None)
):
    params = {k: v for k, v in locals().items() if v is not None and k not in ["router", "settings"]}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{settings.STATS_SERVICE_URL}/api/stats/", params=params)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.json())
    return resp.json()