import uuid
from datetime import datetime
import enum

from sqlalchemy import Column, String, DateTime, Numeric, Integer, Boolean, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID

from shared.database import Base


class SubmissionStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class SalarySubmission(Base):
    __tablename__ = "submissions"
    __table_args__ = {"schema": "salary"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    level = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=True)
    salary_amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), nullable=False, default="LKR")
    experience_years = Column(Integer, nullable=False)
    anonymize = Column(Boolean, default=False, nullable=False)
    status = Column(
        SAEnum(SubmissionStatus, name="submission_status", schema="salary"),
        default=SubmissionStatus.PENDING,
        nullable=False,
    )
    vote_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)