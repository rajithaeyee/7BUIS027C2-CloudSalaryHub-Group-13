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

        salaries = [row[0] for row in query.all()]
        count = len(salaries)
        if count == 0:
            return StatsResponse(average=None, median=None, p25=None, p75=None, count=0)

        avg = sum(salaries) / count
        sorted_sal = sorted(salaries)
        median = self._percentile(sorted_sal, 50)
        p25 = self._percentile(sorted_sal, 25)
        p75 = self._percentile(sorted_sal, 75)

        return StatsResponse(
            average=avg,
            median=median,
            p25=p25,
            p75=p75,
            count=count
        )

    def _percentile(self, data, percentile):
        k = (len(data) - 1) * percentile / 100
        f = int(k)
        c = k - f
        if f + 1 < len(data):
            return data[f] + c * (data[f+1] - data[f])
        else:
            return data[f]