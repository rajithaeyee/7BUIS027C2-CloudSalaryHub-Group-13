from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from uuid import UUID

from shared.database import get_db
from app.schemas import VoteCreate, VoteResponse
from app.services.vote_service import VoteService

router = APIRouter()

@router.post("/", response_model=VoteResponse, status_code=status.HTTP_201_CREATED)
def create_vote(
    payload: VoteCreate,
    x_user_id: UUID = Header(..., description="User ID from BFF after JWT verification"),
    db: Session = Depends(get_db)
):
    service = VoteService(db)
    try:
        vote = service.create_vote(x_user_id, payload)
        return vote
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))