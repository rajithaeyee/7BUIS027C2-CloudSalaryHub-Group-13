from fastapi import APIRouter, Depends, HTTPException
import httpx

from app.config import settings
from app.middleware.auth import require_auth

router = APIRouter()


@router.post("/signup")
async def signup(payload: dict):
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{settings.IDENTITY_SERVICE_URL}/api/auth/signup", json=payload)
    if resp.status_code != 201:
        raise HTTPException(status_code=resp.status_code, detail=resp.json())
    return resp.json()


@router.post("/login")
async def login(payload: dict):
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{settings.IDENTITY_SERVICE_URL}/api/auth/login", json=payload)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.json())
    return resp.json()


@router.get("/me")
async def get_me(user: dict = Depends(require_auth)):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.IDENTITY_SERVICE_URL}/api/auth/me",
            params={"user_id": user["user_id"]},
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.json())
    return resp.json()
