import uuid

from fastapi import APIRouter, Depends
from typing import Annotated    

from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from ..deps import SessionDep, get_current_user
import crud
from model import Token, User, UserIn, UserOut
from core import security

from sqlmodel import select

from typing import Annotated

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
    responses={404: {"description": "Not found"}},
)

# def get_user(session: SessionDep, email: str) -> Any:
#     user = session.exec(select(User).where(User.email == email)).first()
#     return user

@router.post('/login/access-token')
async def login(
        session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
    ) -> Token:
    user = await crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail='Incorrect username or password')
    data = {
        "sub": str(user.id)
    }
    return Token(
        access_token=security.create_access_token(data=data)
    )

@router.post('/login/test-token', response_model=UserOut)
async def read_me(current_user: Annotated[UserOut, Depends(get_current_user)]):
    return current_user

@router.post('/sign-up')
async def sign_up(
        session: SessionDep, user: UserIn
    ):
    hashed_password = security.get_hashed_password(user.password)
    user_to_commit = User(firstname=user.firstname, lastname=user.lastname, username=user.username, email=user.email, hashed_password=hashed_password)
    session.add(user_to_commit)
    session.commit()

    message = {"message": "Successful"}

    return JSONResponse(content=message, status_code=status.HTTP_201_CREATED)

# @router.post('/make-admin')
# async def make_admin(session: SessionDep):
#     user = session.exec(select(User).where(User.id == uuid.UUID('177734a414704f1db29fd4a069f00797', version=4))).one()
#     if not user:
#         raise HTTPException()
#     user.is_admin = True
#     session.add(user)
#     session.commit()
#     message = {'message': 'successful'}
#     return JSONResponse(content=message, status_code=status.HTTP_200_OK)
