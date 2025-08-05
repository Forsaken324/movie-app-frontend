from fastapi import APIRouter

from controllers.show_controllers import retrieve_shows, retrieve_single_show

router = APIRouter(
    prefix='/shows',
    tag=['shows'],
    responses={404: {"description": "Not found"}},
)

@router.get('/')
async def get_shows():
    shows = await retrieve_shows()
        # look for a way to serialize the show data.

@router.get('/{show_id}')
async def get_show(show_id: int):
    show = await retrieve_single_show(show_id)
        # look for a way to serialize this data also.