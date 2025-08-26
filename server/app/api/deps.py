import uuid

from typing import Annotated, Generator

from fastapi import Depends, status
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordBearer

import jwt
from jwt.exceptions import InvalidTokenError

from pydantic import ValidationError

from sqlmodel import Session, select

from core.db import engine
from core.config import settings
from core import security
from model import TokenPayLoad, User

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f'{settings.API_V1_STR}/auth/login/access-token'
)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]

def get_current_user(
        session: SessionDep, token: TokenDep
    ) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayLoad(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = session.get(User, uuid.UUID(token_data.sub, version=4))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_user(session: SessionDep, email: str) -> User:
    user = session.exec(select(User).where(User.email == email)).first()
    return user

def get_admin_user(user: Annotated[User, Depends(get_current_user)]):
    if not user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="You dont have the right permission to carry out this operation",
            headers={'WWW-Authenticate': 'Bearer'}
        )
    return user

AdminDep = Annotated[User, Depends(get_admin_user)]
