from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func
from shared.models.community import Vote, VoteType as DBVoteType
from shared.models.salary import SalarySubmission, SubmissionStatus
from app.schemas import VoteCreate, VoteType as SchemaVoteType
from app.config import settings

class VoteService:
    def __init__(self, db: Session):
        self.db = db

    def create_vote(self, user_id: UUID, payload: VoteCreate) -> Vote:
        db_vote_type = DBVoteType.UPVOTE if payload.vote_type == SchemaVoteType.UPVOTE else DBVoteType.DOWNVOTE

        existing = self.db.query(Vote).filter(
            Vote.user_id == user_id,
            Vote.submission_id == payload.submission_id
        ).first()

        if existing:
            existing.vote_type = db_vote_type
            vote = existing
        else:
            vote = Vote(
                user_id=user_id,
                submission_id=payload.submission_id,
                vote_type=db_vote_type
            )
            self.db.add(vote)

        self.db.flush()

        # Count upvotes for this submission
        upvotes = self.db.query(func.count(Vote.id)).filter(
            Vote.submission_id == payload.submission_id,
            Vote.vote_type == DBVoteType.UPVOTE
        ).scalar()

        # Update submission's vote_count and possibly status
        submission = self.db.query(SalarySubmission).filter(
            SalarySubmission.id == payload.submission_id
        ).first()
        if submission:
            submission.vote_count = upvotes   # always update
            if upvotes >= settings.VOTE_THRESHOLD and submission.status == SubmissionStatus.PENDING:
                submission.status = SubmissionStatus.APPROVED

        self.db.commit()
        self.db.refresh(vote)
        return vote