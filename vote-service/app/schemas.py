from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

class VoteType(str, Enum):
    UPVOTE = "UPVOTE"
    DOWNVOTE = "DOWNVOTE"

class VoteCreate(BaseModel):
    submission_id: UUID
    vote_type: VoteType

class VoteResponse(BaseModel):
    id: UUID
    user_id: UUID
    submission_id: UUID
    vote_type: VoteType
    created_at: datetime   # ← changed from str to datetime

    class Config:
        from_attributes = True