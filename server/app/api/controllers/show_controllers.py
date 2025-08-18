from fastapi.exceptions import HTTPException
import uuid
from sqlmodel import select
from model import Show
from api.deps import SessionDep

async def retrieve_shows(session: SessionDep):
    shows = session.exec(select(Show)).all()
    return shows
    
async def retrieve_single_show(session: SessionDep, show_id: uuid.UUID):
    show = session.exec(select(Show).where(Show.id == show_id)).first()
    if not show:
        raise HTTPException(
            status_code=404,
            detail="The show you searched for was not found"
        )
    return show


# async def create_show(session: SessionDep, show: ShowPayload):
#     ...