from core.config import settings

from sqlmodel import create_engine

engine = create_engine(settings.SQLITE_DB_URL, echo=True)
