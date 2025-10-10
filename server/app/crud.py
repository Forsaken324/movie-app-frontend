from fastapi import HTTPException
from api.deps import SessionDep
from model import User

from api.deps import get_user
from core.security import verify_password
from core.config import settings

async def authenticate(session: SessionDep, email: str, password: str) -> User | None:
    user_in_db = get_user(session=session, email=email)
    if not user_in_db:
        return None
    if not verify_password(password, user_in_db.hashed_password):
        return None
    return user_in_db