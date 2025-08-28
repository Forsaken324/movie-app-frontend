from typing import Annotated

from fastapi import APIRouter, Depends
from api.deps import SessionDep, get_current_user
from model import Booking, User
from sqlmodel import select

router = APIRouter(
    prefix='/user',
    tags=['admin']
)


@router.get('/my-bookings')
async def get_user_bookings(session: SessionDep, user: Annotated[User, Depends(get_current_user)]):
    bookings = session.exec(select(Booking).where(Booking.user_id == user.id)).all()
    return bookings

    

