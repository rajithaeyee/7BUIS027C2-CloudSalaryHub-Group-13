from sqlalchemy.orm import Session
from sqlalchemy import or_
from shared.models.salary import SalarySubmission, SubmissionStatus
from typing import List, Optional

class SearchService:
    def __init__(self, db: Session):
        self.db = db

    def search(
        self,
        company: Optional[str] = None,
        role: Optional[str] = None,
        country: Optional[str] = None,
        level: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[SalarySubmission]:
        query = self.db.query(SalarySubmission).filter(
            SalarySubmission.status == SubmissionStatus.APPROVED
        )
        if company:
            query = query.filter(SalarySubmission.company.ilike(f"%{company}%"))
        if role:
            query = query.filter(SalarySubmission.role.ilike(f"%{role}%"))
        if country:
            query = query.filter(SalarySubmission.country.ilike(f"%{country}%"))
        if level:
            query = query.filter(SalarySubmission.level.ilike(f"%{level}%"))

        return query.offset(skip).limit(limit).all()