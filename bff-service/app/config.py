from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    IDENTITY_SERVICE_URL: str = "http://localhost:8001"
    SALARY_SERVICE_URL: str = "http://localhost:8002"
    SEARCH_SERVICE_URL: str = "http://localhost:8003"
    STATS_SERVICE_URL: str = "http://localhost:8004"
    VOTE_SERVICE_URL: str = "http://localhost:8005"
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()