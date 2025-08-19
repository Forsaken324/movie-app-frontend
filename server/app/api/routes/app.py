from fastapi import APIRouter
from sqlmodel import select
from model import Genre

from ..deps import SessionDep

router = APIRouter()

@router.get('/genres')
async def get_genres(session: SessionDep):
    genres = session.exec(select(Genre)).all()
    return genres
