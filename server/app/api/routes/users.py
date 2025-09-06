from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from api.deps import SessionDep, get_current_user
from model import Booking, ShowResponse, User, OccupiedSeat, Favourites
from sqlmodel import select

from api.controllers.show_controllers import retrieve_single_show
from api.lib.helpers import to_uuid4

import requests

import os
from dotenv import load_dotenv

load_dotenv()


router = APIRouter(
    prefix='/user',
    tags=['admin']
)


@router.get('/my-bookings')
async def get_user_bookings(session: SessionDep, user: Annotated[User, Depends(get_current_user)], trxref: str | None = None, reference: str | None = None):
    if trxref and reference:
        backend_url: str | None = os.getenv('BACKEND_URL')
        if not backend_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='incomplete development keys'
            )
        verify_payment_url = backend_url + f'/verify-show-payment?trxref={trxref}&reference={reference}'
        response = requests.get(verify_payment_url)
        if response.status_code == 200:
            return JSONResponse(
                content={'message':'payment successful'},
                status_code=status.HTTP_200_OK
            )
        return JSONResponse(
            content={'message': 'Your transaction was not successful or is pending, please contact the admin for more details'},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    response = []
    bookings = session.exec(select(Booking).where(Booking.user_id == user.id)).all()
    for booking in bookings:
        show = await retrieve_single_show(session=session, show_id=str(booking.show_id))
        booked_seats = session.exec(select(OccupiedSeat.seat).where(OccupiedSeat.booking_id == booking.id and OccupiedSeat.user_id == user.id)).all()
        payload = {
            'id': booking.id,
            'user': {'name': user.username},
            'show': {
                'id': show.id,
                'movie': show,
                'show_date_time': booking.show_time,
                'show_price': show.price
            },
            'amount': booking.amount,
            'booked_seats': booked_seats,
            'is_paid': booking.is_paid
        }
        response.append(payload)
    return response[::-1]


@router.get('/favourite-shows', response_model=List[ShowResponse])
async def get_user_favourite_shows(session: SessionDep, user: Annotated[User, Depends(get_current_user)]):
    response = []
    favourites = session.exec(select(Favourites).where(Favourites.user_id == user.id)).all()

    for favourite in favourites:
        show = await retrieve_single_show(session=session, show_id=str(favourite.show_id))
        response.append(show)

    return response
    
@router.post('/add-favourite-show/{show_id}')
async def add_favourite_show(session: SessionDep,show_id: str, user: Annotated[User, Depends(get_current_user)]):
    favourite = Favourites(user_id=user.id, show_id=to_uuid4(show_id)) # type: ignore
    favourite_in_db = set(session.exec(select(Favourites.show_id).where(Favourites.user_id == user.id)).all())
    if favourite.show_id in favourite_in_db:
        del favourite
        del favourite_in_db
        raise HTTPException(
            detail='You have already added this show as a favourite',
            status_code=status.HTTP_400_BAD_REQUEST
        )
    session.add(favourite)
    session.commit()
    return JSONResponse(
        content={'message': 'successful'},
        status_code=status.HTTP_200_OK,
    )