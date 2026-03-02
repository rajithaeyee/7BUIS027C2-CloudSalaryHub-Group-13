from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SALARY_SERVICE_URL: str = "http://localhost:8001"
    IDENTITY_SERVICE_URL: str = "http://localhost:8002"
    VOTE_SERVICE_URL: str = "http://localhost:8003"
    SEARCH_SERVICE_URL: str = "http://localhost:8004"
    STATS_SERVICE_URL: str = "http://localhost:8005"
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()