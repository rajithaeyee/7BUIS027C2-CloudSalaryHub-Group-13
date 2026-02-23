from uuid import UUID
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class SubmissionCreate(BaseModel):
    company: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., min_length=1, max_length=255)
    level: str = Field(..., min_length=1, max_length=100)
    country: str = Field(..., min_length=1, max_length=100)
    city: str | None = Field(None, max_length=100)
    salary_amount: Decimal = Field(..., gt=0)
    currency: str = Field(default="LKR", max_length=10)
    experience_years: int = Field(..., ge=0)
    anonymize: bool = False


class SubmissionResponse(BaseModel):
    id: UUID
    company: str
    role: str
    level: str
    country: str
    city: str | None
    salary_amount: Decimal
    currency: str
    experience_years: int
    anonymize: bool
    status: str
    vote_count: int
    created_at: datetime

    class Config:
        from_attributes = True
