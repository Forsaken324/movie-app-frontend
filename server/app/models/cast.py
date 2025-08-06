from sqlmodel import SQLModel, Field

class Cast(SQLModel):
    name: str = Field(min_items=2, max_length=256)
    profile_path: str = Field(min_items=2, max_length=256)
    