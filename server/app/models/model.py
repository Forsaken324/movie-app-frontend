from datetime import date

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

class Show(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=256, index=True)
    overview: str = Field(min_length=1, max_length=256)
    poster_path: str = Field(min_length=1, max_length=256)
    backdrop_path: str = Field(min_length=1, max_length=256)


class Genre(SQLModel, table=True):
    name: str = Field(min_length=1, max_length=256)



class Cast(SQLModel, table=True):
    name: str = Field(min_length=2, max_length=256)
    profile_path: str = Field(min_length=2, max_length=256)


class Booking(SQLModel, table=True):
    ...