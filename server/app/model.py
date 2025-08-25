import uuid
from typing import List

from pydantic import BaseModel, EmailStr
from datetime import date, datetime, time
from sqlmodel import Field, Relationship, SQLModel

class ShowCastLink(SQLModel, table=True):
    cast_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key="cast.id", primary_key=True)
    show_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key="show.id", primary_key=True)

class ShowGenreLink(SQLModel, table=True):
    genre_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key="genre.id", primary_key=True)
    show_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key="show.id", primary_key=True)

class Genre(SQLModel, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=256, index=True)
    shows: List['Show'] = Relationship(back_populates='genres', link_model=ShowGenreLink)

class AddGenre(SQLModel):
    show_id: str
    genres: List[str]

class GenreOut(SQLModel):
    name: str

class Cast(SQLModel, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=256, index=True)
    profile_path: str = Field(max_length=500)
    shows: List['Show'] = Relationship(back_populates="casts", link_model=ShowCastLink)

class CastPayload(SQLModel):
    name: str
    profile_path: str

class AddCast(SQLModel):
    show_id: str
    casts: List[str]

class ShowTime(SQLModel, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    show_id: uuid.UUID = Field(foreign_key='show.id')
    show_time: datetime

class ShowTimeIn(SQLModel):
    show_id: str
    show_time: datetime

class Show(SQLModel, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
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
    is_active: bool | None = False

class ShowResponse(SQLModel):
    id: uuid.UUID
    title: str
    overview: str
    poster_path: str
    backdrop_path: str
    genres: List['GenreOut']
    casts: List['CastPayload']
    release_date: date
    original_language: str
    tagline: str
    vote_average: float
    vote_count: int
    runtime: int

class ShowIn(SQLModel):
    title: str = Field(min_length=1, max_length=256, index=True)
    overview: str = Field(min_length=1, max_length=256)
    poster_path: str = Field(min_length=1, max_length=256)
    backdrop_path: str = Field(min_length=1, max_length=256)
    release_date: date
    original_language: str = Field()
    tagline: str = Field(max_length=256)
    vote_average: float
    vote_count: int
    runtime: int
    
# class Seat(BaseModel):
#     seat: str

class OccupiedSeat(SQLModel, table=True):
    seat: str
    show_id: uuid.UUID = Field(primary_key=True, foreign_key='show.id')
    user_id: uuid.UUID = Field(primary_key=True, foreign_key='user.id')
    date: datetime

class Booking(SQLModel, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key='user.id', index=True)
    showid: uuid.UUID = Field(foreign_key='show.id', index=True)
    show_time: datetime
    amount: float
    is_paid: bool

class Favourites(SQLModel, table=True):
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key='user.id', primary_key=True)
    show_id: uuid.UUID = Field(default_factory=uuid.uuid4, foreign_key='show.id', primary_key=True)

class User(SQLModel, table=True):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    firstname: str
    lastname: str
    username: str = Field(index=True)
    email: EmailStr = Field(index=True, unique=True)
    hashed_password: str
    image_path: str | None = Field(default=None)
    is_admin: bool = Field(default=False)

class UserOut(BaseModel):
    firstname: str
    lastname: str
    username: str
    email: EmailStr

class UserIn(UserOut):
    password: str = Field(regex='^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')


class Token(SQLModel):
    access_token: str
    token_type: str = 'bearer'

class TokenPayLoad(SQLModel):
    sub: str | None = None


# {
#   "show_id": "string",
#   "casts": [
#     "d26a9dee3b1d40758e97bdf1434ec57b",
#     "786da84441df4e83b21ec341719be28c",
#     "c46b25bee6704625ba381f544accb21d",
#     "a8a02de5c4644af0977e536edd694587",
#     "422ee813eae44125998e895d24944b6f",
#     "9f53fbda98534e24b0831dc31dc81b61",
#     "ab523dfb1f724efd974852e77c5dee46",
#     "88d82563072b4cdeb396134ff40801cd",
#     "3e47fff9b92342fea244a5910e98d4b3",
#     "84aeb72bd86f4adab5337055541bd918",
#     "020a77faca184cde83be037d6b582cf7",
#     "98e2517a8dde4d5182cd0f396ef6be68",
#     "e7e002a4445346b39fd74e9515a86bf2",
#     "02df770fed1845dea536384a62184bd9",
#     "09060bccff404f6a9adadb3a8480875d",
#     "4c3a0a9c467b4e60bb5cb78765b0998b",
#     "792fde94817241f5bb0ec5e8676ea522"
#   ]
# }
