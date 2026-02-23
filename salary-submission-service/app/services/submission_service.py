from uuid import UUID

from sqlalchemy.orm import Session

from shared.models.salary import SalarySubmission, SubmissionStatus
from app.schemas import SubmissionCreate


class SubmissionService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, payload: SubmissionCreate) -> SalarySubmission:
        submission = SalarySubmission(
            company=payload.company,
            role=payload.role,
            level=payload.level,
            country=payload.country,
            city=payload.city,
            salary_amount=payload.salary_amount,
            currency=payload.currency,
            experience_years=payload.experience_years,
            anonymize=payload.anonymize,
            status=SubmissionStatus.PENDING,
        )
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)
        return submission

    def get_by_id(self, submission_id: UUID) -> SalarySubmission | None:
        return self.db.query(SalarySubmission).filter(
            SalarySubmission.id == submission_id
        ).first()

    def get_all(self, skip: int = 0, limit: int = 20) -> list[SalarySubmission]:
        return self.db.query(SalarySubmission).offset(skip).limit(limit).all()
