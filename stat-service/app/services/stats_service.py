from decimal import Decimal
from sqlalchemy.orm import Session
from shared.models.salary import SalarySubmission, SubmissionStatus
from typing import Optional
from app.schemas import StatsResponse

class StatsService:
    def __init__(self, db: Session):
        self.db = db

    def get_stats(self, country: Optional[str] = None, role: Optional[str] = None) -> StatsResponse:
        query = self.db.query(SalarySubmission.salary_amount).filter(
            SalarySubmission.status == SubmissionStatus.APPROVED
        )
        if country:
            query = query.filter(SalarySubmission.country == country)
        if role:
            query = query.filter(SalarySubmission.role == role)

        salaries = [row[0] for row in query.all()]  # list of Decimal
        count = len(salaries)
        if count == 0:
            return StatsResponse(average=None, median=None, p25=None, p75=None, count=0)

        # Convert Decimal to float for calculations
        salaries_float = [float(s) for s in salaries]
        avg = sum(salaries_float) / count
        sorted_sal = sorted(salaries_float)

        median = self._percentile(sorted_sal, 50)
        p25 = self._percentile(sorted_sal, 25)
        p75 = self._percentile(sorted_sal, 75)

        return StatsResponse(
            average=Decimal(str(avg)),
            median=median,
            p25=p25,
            p75=p75,
            count=count
        )

    def _percentile(self, data: list, percentile: int) -> Optional[Decimal]:
        if not data:
            return None
        k = (len(data) - 1) * percentile / 100
        f = int(k)
        c = k - f
        if f + 1 < len(data):
            result = data[f] + c * (data[f+1] - data[f])
        else:
            result = data[f]
        return Decimal(str(result))