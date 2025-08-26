import os

from typing import List
from collections import defaultdict

from fastapi import APIRouter
from api.deps import SessionDep, get_user
import uuid
from api.controllers.show_controllers import retrieve_shows, retrieve_single_show
from model import ShowResponse, ShowTime, BookingIn
from sqlmodel import select
from api.lib.helpers import to_uuid4



router = APIRouter(
    prefix='/shows',
    tags=['shows'],
    responses={404: {"description": "Not found"}},
)

PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_TEST_SECRET')

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


@router.post('/book-show/{show_id}')
async def book_show(session: SessionDep, show_id: str, user: Depends(get_user), booking_payload: BookingIn):
    show = await retrieve_single_show(show_id)
    booked_seats_in = booking_payload.booked_seats
    total_amout = booking_payload.amount * len(booked_seats_in)

    booking = Booking(user_id=user.id, show_id=to_uuid4(show_id), show_time=booking_payload.show_time, amount=total_amount)
    session.add(booking)
    session.commit()

    occupied_seats = session.exec(select(OccupiedSeat.seat)

    for seat in booked_seats_in:
        pending_db_seat = OccupiedSeat(show_id=booking.show_id, user_id=user.id, booking_id=booking.id)
        session.add(pending_db_seat)
        session.commit()


    
    


@router.post('/show/make-payment/{booking_id}')
async def pay_for_booked_show(session: SessionDep, booking_id: str, user: Depends(get_user)):
    booking = session.exec(select(Booking).where(Booking.id == to_uuid4(booking_id)).first()
    if booking:
        ...
