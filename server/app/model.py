import uuid
from typing import List

from pydantic import BaseModel
from datetime import date, datetime
from sqlmodel import Field, Relationship, SQLModel

class ShowCastLink(SQLModel, table=True):
    cast_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key="cast.id", primary_key=True)
    show_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key="show.id", primary_key=True)

class ShowGenreLink(SQLModel, table=True):
    genre_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key="genre.id", primary_key=True)
    show_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key="show.id", primary_key=True)

class Genre(SQLModel, table=True):
    id: uuid.UUID | None = Field(default=None, default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=256)
    shows: List['Show'] = Relationship(back_populates='genres', link_model=ShowGenreLink)

class Cast(SQLModel, table=True):
    id: uuid.UUID | None = Field(default=None, default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=256, index=True)
    shows: List['Show'] = Relationship(back_populates="casts", link_model=ShowCastLink)

class Show(SQLModel, table=True):
    id: uuid.UUID | None = Field(default=None, default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(min_length=1, max_length=256, index=True)
    overview: str = Field(min_length=1, max_length=256)
    poster_path: str = Field(min_length=1, max_length=256)
    backdrop_path: str = Field(min_length=1, max_length=256)
    genres: List['Genre'] = Relationship(back_populates='shows', link_model=ShowGenreLink)
    casts: List['Cast'] = Relationship(back_populates="shows", link_model=ShowCastLink)
    release_date: date
    original_language: str = Field()
    tagline: str = Field(max_length=256)
    vote_average: float
    vote_count: int
    runtime: int

class Seat(BaseModel):
    seat: str

class OccupiedSeat(Seat):
    user_id: uuid.UUID

class ActiveShow(SQLModel, table=True):
    id: uuid.UUID | None = Field(default=None, default_factory=uuid.uuid4, primary_key=True)
    show_id: uuid.UUID = Field(foreign_key='show.id')
    show_datetime: datetime
    occupied_seats: List[OccupiedSeat]

class User(SQLModel, table=True):
    ...

class Booking(SQLModel, table=True):
    id: uuid.UUID | None = Field(default=None, default_factory=uuid.uuid4)
    user: uuid.UUID = Field(foreign_key='user.id')
    show: uuid.UUID = Field(foreign_key='show.id')
    amount: float
    booked_seats: List[Seat]
    is_paid: bool



class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

