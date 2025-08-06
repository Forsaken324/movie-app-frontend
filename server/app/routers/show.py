from fastapi import APIRouter

router = APIRouter(
    prefix='/shows',
    tags=['shows'],
    responses={404: {"description": "Not found"}},
)

@router.get('/')
async def get_shows():
    ...

@router.get('/{show_id}')
async def get_show(show_id: int):
    ...