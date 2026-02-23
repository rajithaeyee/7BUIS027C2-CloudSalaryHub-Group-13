import uuid
from datetime import datetime
import enum

from sqlalchemy import Column, String, DateTime, Enum as SAEnum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID

from shared.database import Base


class VoteType(str, enum.Enum):
    UPVOTE = "UPVOTE"
    DOWNVOTE = "DOWNVOTE"


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (
        UniqueConstraint("user_id", "submission_id", name="uq_user_submission_vote"),
        {"schema": "community"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    submission_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    vote_type = Column(
        SAEnum(VoteType, name="vote_type", schema="community"),
        nullable=False,
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Report(Base):
    __tablename__ = "reports"
    __table_args__ = (
        UniqueConstraint("user_id", "submission_id", name="uq_user_submission_report"),
        {"schema": "community"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    submission_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    reason = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)