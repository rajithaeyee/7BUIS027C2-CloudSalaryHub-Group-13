import hashlib
from uuid import UUID
from datetime import datetime, timedelta, timezone

import jwt
import bcrypt
from sqlalchemy.orm import Session

from shared.models.identity import User, BlockedToken
from app.schemas import SignupRequest
from app.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, payload: SignupRequest) -> User:
        user = User(
            email=payload.email,
            username=payload.username,
            password_hash=hash_password(payload.password),
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate(self, email: str, password: str) -> User | None:
        user = self.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    def generate_token(self, user: User) -> str:
        payload = {
            "sub": str(user.id),
            "username": user.username,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES),
            "iat": datetime.now(timezone.utc),
        }
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    def invalidate_token(self, token: str) -> None:
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc).replace(tzinfo=None)
        except jwt.PyJWTError:
            expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
        blocked = BlockedToken(token_hash=token_hash, expires_at=expires_at)
        self.db.add(blocked)
        self.db.commit()

    def decode_token(self, token: str) -> dict | None:
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        blocked = self.db.query(BlockedToken).filter(BlockedToken.token_hash == token_hash).first()
        if blocked:
            return None
        return {"user_id": payload["sub"], "username": payload["username"]}

    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str) -> User | None:
        return self.db.query(User).filter(User.username == username).first()

    def get_by_id(self, user_id: UUID) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()
