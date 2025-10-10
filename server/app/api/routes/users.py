from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status, Form, File
from fastapi.responses import JSONResponse
from api.deps import SessionDep, get_current_user
from model import Booking, ShowResponse, User, OccupiedSeat, Favourites, EditUser
from sqlmodel import select
from core.config import settings
from core.security import get_hashed_password

from api.controllers.show_controllers import retrieve_single_show
from api.lib.helpers import to_uuid4, upload_image_to_cloudinary
from api.lib.payment_handlers import verify_payment
from crud import authenticate

from dotenv import load_dotenv

load_dotenv()


router = APIRouter(
    prefix='/user',
    tags=['admin']
)


@router.get('/my-bookings')
async def get_user_bookings(session: SessionDep, user: Annotated[User, Depends(get_current_user)], trxref: str | None = None, reference: str | None = None):
    payment_message = ''
    print(f'references: {trxref}, {reference}')
    if trxref and reference:
        payment_message = await verify_payment(session=session, trxref=trxref, reference=reference)
    
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

    final_response = {
        'payment_message': payment_message,
        'bookings': response[::-1]
    }

    return final_response


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
        favourite_to_remove = session.exec(select(Favourites).where(Favourites.user_id == user.id and Favourites.show_id == favourite.show_id)).one()
        session.delete(favourite_to_remove)
        session.commit()

        return JSONResponse(
            content={'message': 'Show successfully removed from favourites'},
            status_code=status.HTTP_200_OK
        )
    
    session.add(favourite)
    session.commit()
    return JSONResponse(
        content={'message': 'Show successfully added to favourites'},
        status_code=status.HTTP_200_OK,
    )


@router.put('/edit-profile')
async def edit_user_profile(
    session: SessionDep, 
    user: Annotated[User, Depends(get_current_user)], 
    firstname: str = Form(...), 
    lastname: str = Form(...), 
    old_password: str | None = Form(None), 
    new_password: str | None = Form(None),
    profile_image: UploadFile | None = File(None)
):
    user_stored = session.exec(select(User).where(User.email == user.email)).one()

    if new_password and old_password:

        if not await authenticate(session=session, email=user.email,password=old_password):
            
            raise HTTPException(
                detail='sorry your old password did not match',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        new_password_hashed = get_hashed_password(new_password)
        user_stored.hashed_password = new_password_hashed

    user_stored.firstname = firstname
    user_stored.lastname = lastname
    

    if profile_image:
        n_profile_image= await profile_image.read()
        cloud_image_path = await upload_image_to_cloudinary(n_profile_image, user_stored.firstname, user_stored.lastname)
        if not cloud_image_path:
            raise HTTPException(
                detail='Sorry an error occured when uploading your profile picture',
                status_code=status.HTTP_408_REQUEST_TIMEOUT
            )
        
        user_stored.image_path = cloud_image_path
    
    session.add(user_stored)
    session.commit()

    return JSONResponse({'message': 'successful'}, status_code=status.HTTP_200_OK)

    


