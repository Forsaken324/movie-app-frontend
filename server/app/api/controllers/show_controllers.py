from fastapi.exceptions import HTTPException

from sqlmodel import select
from models.model import Show
from app.api.deps import SessionDep

async def retrieve_shows(session: SessionDep):
    shows = session.exec(select(Show)).all()
    return shows
    
async def retrieve_single_show(session: SessionDep, show_id: int):
    show = session.get(Show, show_id)
    if not show:
        raise HTTPException(
            status_code=404,
            detail="The show you searched for was not found"
        )
    return show


async def create_show(session: SessionDep, show: ShowPayload):
    ...