from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from shared.database import get_db
from app.schemas import SubmissionCreate, SubmissionResponse
from app.services.submission_service import SubmissionService

router = APIRouter()


@router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_submission(payload: SubmissionCreate, db: Session = Depends(get_db)):
    service = SubmissionService(db)
    return service.create(payload)


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(submission_id: UUID, db: Session = Depends(get_db)):
    service = SubmissionService(db)
    submission = service.get_by_id(submission_id)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    return submission


@router.get("/", response_model=list[SubmissionResponse])
def list_submissions(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    service = SubmissionService(db)
    return service.get_all(skip=skip, limit=limit)
