from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from models.forms.form import SignInForm

from typing import Annotated

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
    responses={404: {"description": "Not found"}},
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

@router.get('/test_token')
async def read_items(token: Annotated[str , Depends(oauth2_scheme)]):
    return {"token": token}

@router.post('/sign-in')
async def sign_in(form: SignInForm):
    ...