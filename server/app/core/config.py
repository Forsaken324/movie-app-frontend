from pathlib import Path
from pydantic import computed_field, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

import secrets


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file= "../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32),
        description="App secret Key (loaded from env or generated at runtime)"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    FRONTEND_HOST: str = "http://localhost:5173"
    SQLITE_FILENAME: str = "database.db"
    SQLITE_PATH: Path = Path(__file__).resolve().parent.parent / "db"
    PROJECT_NAME: str = "Quickshow API"
    
    @computed_field
    @property
    def SQLITE_DB_URL(self) -> str:
        return f"sqlite:///{self.SQLITE_PATH / self.SQLITE_FILENAME}"
    



settings = Settings() # type: ignore