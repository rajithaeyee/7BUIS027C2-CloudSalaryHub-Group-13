from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from shared.database import get_db
from app.schemas import SalarySearchResult
from app.services.search_service import SearchService

router = APIRouter()

@router.get("/", response_model=List[SalarySearchResult])
def search(
    company: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    service = SearchService(db)
    results = service.search(company, role, country, level, skip, limit)
    # Apply anonymization
    for res in results:
        if res.anonymize:
            res.company = "Anonymous"
    return results