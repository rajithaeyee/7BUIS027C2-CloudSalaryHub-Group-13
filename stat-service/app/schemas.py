from decimal import Decimal
from pydantic import BaseModel
from typing import Optional

class StatsResponse(BaseModel):
    average: Optional[Decimal]
    median: Optional[Decimal]
    p25: Optional[Decimal]
    p75: Optional[Decimal]
    count: int