import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

class Show(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=256)
    overview: str = Field(min_length=1, max_length=256)
    poster_path: str = Field(min_length=1, max_length=256)
    backdrop_path: str = Field(min_length=1, max_length=256)
    