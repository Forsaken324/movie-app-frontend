import os

from typing import List, Annotated
from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from api.deps import SessionDep, get_current_user
import uuid
from api.controllers.show_controllers import retrieve_shows, retrieve_single_show
from model import ShowResponse, ShowTime, BookingIn, User, Booking, OccupiedSeat, Transaction
from core.config import settings
from sqlmodel import select
from api.lib.helpers import to_uuid4

import paystack
from dotenv import load_dotenv

load_dotenv()


router = APIRouter(
    prefix='/shows',
    tags=['shows'],
    responses={404: {"description": "Not found"}},
)

PAYSTACK_SECRET_KEY= os.getenv('PAYSTACK_TEST_SECRET')
paystack.api_key= PAYSTACK_SECRET_KEY
CALLBACK_URL = os.getenv('BACKEND_URL')

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
async def book_show(session: SessionDep, show_id: str, user: Annotated[User, Depends(get_current_user)], booking_payload: BookingIn):
    booked_seats_in = booking_payload.booked_seats
    total_amount = booking_payload.amount * len(booked_seats_in)
    time_zone = booking_payload.show_time.tzinfo
    todays_date = datetime.now(time_zone)

    if booking_payload.show_time < todays_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'You cannot book for a day in the past, contact the admin'
        )
    del time_zone
    del todays_date

    booking = Booking(user_id=user.id, show_id=to_uuid4(show_id), show_time=booking_payload.show_time, amount=total_amount)
    session.add(booking)
    occupied_seats = set(session.exec(select(OccupiedSeat.seat).where(OccupiedSeat.show_id == to_uuid4(show_id))).all())

    for seat in booked_seats_in:
        if seat in occupied_seats:
            del booking
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'The seat you selected {seat} is already occupied'
            )

        pending_db_seat = OccupiedSeat(seat=seat, show_id=booking.show_id, user_id=user.id, booking_id=booking.id)
        session.add(pending_db_seat)

    session.commit()
    
    return JSONResponse('Successful', status_code=status.HTTP_200_OK)


@router.post('/show/make-payment/{booking_id}')
async def pay_for_booked_show(session: SessionDep, booking_id: str, user: Annotated[User, Depends(get_current_user)]):
    booking = session.exec(select(Booking).where(Booking.id == to_uuid4(booking_id))).first()
    time_zn = booking.show_time.tzinfo
    today = datetime.now(time_zn)
    if not booking:
        raise HTTPException(
            detail='The booking you want to make a payment for does not exist',
            status_code=status.HTTP_400_BAD_REQUEST
        )
    if not CALLBACK_URL:
        raise HTTPException(
            detail='sorry callback url was not found',
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    verify_transaction_url = CALLBACK_URL + settings.API_V1_STR + '/auth/verify-show-payment'
    response = paystack.Transaction.initialize(
        email=user.email,
        amount=booking.amount,
        callback_url=verify_transaction_url,
    )
    
    if not response.status:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An error occured when processing the transaction"
        )
    
    transaction = Transaction(
        user_id=user.id,
        show_id=booking.show_id,
        booking_id=booking.id,
        transaction_reference=response.data['reference'],
        transaction_status='ongoing',
        created_at=today
    )
    
    session.add(transaction)
    session.commit()

    return response.data['authorization_url']

