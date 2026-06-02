from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "LukaScope API"
    environment: str = Field(default="development", alias="NODE_ENV")
    database_url: str = "sqlite:///./data/lukascope.db"
    redis_url: str = "redis://localhost:6379/0"
    frontend_url: str = "http://localhost:3000"
    storage_root: Path = Path("./data/storage")
    asset_url_path: str = "/assets"
    active_model_version: str = "heuristic-v0.1"
    active_model_path: Path = Path("./models/active/model.pt")
    max_upload_bytes: int = 10 * 1024 * 1024
    run_jobs_inline: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
