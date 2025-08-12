from dotenv import load_dotenv
import os
import secrets
from pydantic import computed_field   
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file= "../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_V1_STR = "/api/v1"
    SECRET_KEY: str = SECRET_KEY
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    FRONTEND_HOST: str = "http://localhost:5173"
    SQLITE_FILENAME: str = "database.db"
    SQLITE_PATH: str = "../db/"
    
    @computed_field
    @property
    def SQLITE_DB_URL(self) -> str:
        return f"sqlite///{self.SQLITE_PATH}/{self.SQLITE_FILENAME}"
    



settings = Settings() # type: ignore