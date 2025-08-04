from pydantic import BaseModel, EmailStr, Field
from typing import List
from models.genre import Genre
from models.cast import Cast
from datetime import date
from enum import Enum

password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$"

class LanguageCode(Enum):
    en = 'en'
    de = 'de'
    ar = 'ar'
    fr = 'fr'
    yo = 'yo'
    he = 'he'
    ha = 'ha'
    ig = 'ig'
    oro = 'oro'

class SignInForm(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, pattern=password_regex)
    model_config = {"extra": "forbid"}


class CreateUser(BaseModel):
    email: EmailStr
    firstname: str = Field(min_length=2, max_length=256)
    lastname: str = Field(min_length=2, max_length=256)
    phone_number: int = Field(min_length=10, max_length=11)
    password: str = Field(min_length=12, pattern=password_regex)
    image_url: str | None


class CreateShow(BaseModel):
    title: str = Field(min_length=4, max_length=126)
    overview: str = Field(min_length=4, max_length=126)
    poster_path: str = Field(min_length=4, max_length=126)
    backdrop_path: str = Field(min_length=4, max_length=126)
    genres: List[Genre] = Field(min=1)
    casts: List[Cast]
    release_date: date
    original_language: LanguageCode
    tagline: str = Field(max_length=256)
    runtime: int

class Booking(BaseModel):
    ...