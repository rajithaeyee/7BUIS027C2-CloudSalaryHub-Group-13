from fastapi import APIRouter, Depends, HTTPException
import httpx

from app.config import settings
from app.middleware.auth import require_auth   # adjust import path if needed

router = APIRouter()

@router.post("/")
async def create_vote(
    payload: dict,
    user: dict = Depends(require_auth)
):
    headers = {"X-User-ID": user["user_id"]}
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.VOTE_SERVICE_URL}/api/votes/",
            json=payload,
            headers=headers
        )
    if resp.status_code != 201:
        # Try to parse JSON, fallback to raw text
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text or "Unknown error"
    return resp.json()