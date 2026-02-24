from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from typing import Optional

class SalarySearchResult(BaseModel):
    id: UUID
    company: Optional[str]
    role: str
    level: Optional[str]
    country: str
    city: Optional[str]
    salary_amount: Decimal
    currency: str
    experience_years: int
    anonymize: bool
    created_at: datetime

    class Config:
        from_attributes = True