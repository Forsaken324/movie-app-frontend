from typing import List
from collections import defaultdict

from fastapi import APIRouter
from api.deps import SessionDep
import uuid
from api.controllers.show_controllers import retrieve_shows, retrieve_single_show
from model import ShowResponse, ShowTime
from sqlmodel import select
from api.lib.helpers import to_uuid4


router = APIRouter(
    prefix='/shows',
    tags=['shows'],
    responses={404: {"description": "Not found"}},
)

@router.get('/', response_model=List[ShowResponse])
async def get_shows(session: SessionDep):
    shows = await retrieve_shows(session=session)
    return shows
        # look for a way to serialize the show data.

@router.get('/{show_id}', response_model=ShowResponse)
async def get_show(session: SessionDep, show_id: str):
    show = await retrieve_single_show(session=session, show_id=show_id)
    return show
    # look for a way to serialize this data also.
    # to serialize the data, you can use model_to_json_dump


@router.get('/{show_id}/time')
async def get_show_time(session: SessionDep, show_id: str):
    schedules = session.exec(select(ShowTime).where(ShowTime.show_id == to_uuid4(show_id))).all()

    grouped = defaultdict(list)

    for s in schedules:
        date_key = s.show_time.date().isoformat()
        grouped[date_key].append({
            "time": s.show_time.isoformat(),
            "showId": str(s.show_id)
        })
    
    return grouped

