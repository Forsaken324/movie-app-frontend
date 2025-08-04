from sqlmodel import SQLModel, Field

class Genre(SQLModel):
    name: str = Field(min_length=1, max_length=256)
