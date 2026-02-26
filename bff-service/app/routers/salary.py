from uuid import UUID

from fastapi import APIRouter, HTTPException
import httpx

from app.config import settings

router = APIRouter()


@router.post("/")
async def create_submission(payload: dict):
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{settings.SALARY_SERVICE_URL}/api/submissions/", json=payload)
    if resp.status_code != 201:
        raise HTTPException(status_code=resp.status_code, detail=resp.json())
    return resp.json()


@router.get("/{submission_id}")
async def get_submission(submission_id: UUID):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{settings.SALARY_SERVICE_URL}/api/submissions/{submission_id}")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.json())
    return resp.json()


@router.get("/")
async def list_submissions(skip: int = 0, limit: int = 20):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{settings.SALARY_SERVICE_URL}/api/submissions/", params={"skip": skip, "limit": limit})
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.json())
    return resp.json()
