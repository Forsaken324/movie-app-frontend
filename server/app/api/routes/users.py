from fastapi import APIRouter
from api.deps import SessionDep, get_user

router = APIRouter(
    prefix='/user',
    tags=['admin']
)


@router.get('/my-bookings')
async def get_user_bookings(session: SessionDep, user: Annotated[User, Depends(get_user)]):
    ...
    

