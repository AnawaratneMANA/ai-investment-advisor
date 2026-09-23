"""Application settings loaded from environment variables."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the API service."""

    app_name: str = "AI Investment Advisor API"
    app_version: str = "0.1.0"
    app_env: str = "development"
    log_level: str = "INFO"
    # Use an application-specific name so unrelated shell variables such as DEBUG=release do
    # not change or invalidate API startup.
    debug: bool = Field(default=False, validation_alias="APP_DEBUG")
    database_url: str = "sqlite:///./investment_advisor.db"
    redis_url: str | None = None
    auth_secret_key: str = "development-only-change-this-secret"
    session_cookie_name: str = "investment_advisor_session"
    session_expire_minutes: int = 60
    cookie_secure: bool = False
    web_origin: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    """Return one cached settings object for the process."""

    return Settings()
