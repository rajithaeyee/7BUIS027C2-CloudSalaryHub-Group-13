from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from shared.database import get_db
from app.schemas import StatsResponse
from app.services.stats_service import StatsService

router = APIRouter()

@router.get("/", response_model=StatsResponse)
def get_stats(
    country: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = StatsService(db)
    return service.get_stats(country, role)