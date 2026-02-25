from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    VOTE_THRESHOLD: int = 3
    JWT_SECRET: str = "change-me-in-production"   # optional, for token decode

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()