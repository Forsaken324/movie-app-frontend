from pydantic import BaseModel

class Cast(BaseModel):
    name: str
    profile_path: str
    