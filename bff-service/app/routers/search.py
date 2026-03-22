from fastapi import APIRouter, HTTPException, Query, Header
import httpx
from typing import Optional
import jwt

from app.config import settings

router = APIRouter()

@router.get("/")
async def search(
    company: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    authorization: Optional[str] = Header(None)
):
    # Determine if user is authenticated
    include_pending = False
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            include_pending = True  # token is valid
        except:
            pass  # invalid token – treat as guest

    params = {
        "company": company,
        "role": role,
        "country": country,
        "level": level,
        "include_pending": include_pending,
        "skip": skip,
        "limit": limit
    }
    # Remove None values
    params = {k: v for k, v in params.items() if v is not None}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{settings.SEARCH_SERVICE_URL}/api/search/", params=params)
    if resp.status_code != 200:
        try:
            detail = resp.json()
        except:
            detail = resp.text or "Unknown error"
        raise HTTPException(status_code=resp.status_code, detail=detail)
    return resp.json()