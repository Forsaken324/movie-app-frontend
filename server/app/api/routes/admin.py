from typing import Annotated, Dict
from datetime import datetime

from ..controllers.show_controllers import retrieve_single_show
from ..lib.helpers import to_uuid4
from model import AddCast, AddGenre, Booking, Cast, CastPayload, Genre, OccupiedSeat, ShowIn, ShowTime, ShowTimeIn, User, Show

from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse

from sqlmodel import select

from api.deps import SessionDep, get_admin_user

router = APIRouter(
    prefix='/admin',
    tags=['admin']
)

success_message: Dict[str, str] = {
        "message": "Successful",
    }


@router.post('/create-show', dependencies=[Depends(get_admin_user)])
async def create_show(session: SessionDep, show: ShowIn):
    new_show = Show(
        title=show.title, overview=show.overview, poster_path=show.poster_path, backdrop_path=show.backdrop_path, release_date=show.release_date, original_language=show.original_language, tagline=show.tagline, vote_average=show.vote_average, vote_count=show.vote_count, runtime=show.runtime
    )
    session.add(new_show)
    session.commit()
    
    return JSONResponse(success_message, status_code=status.HTTP_201_CREATED)

@router.post('/create-genre', dependencies=[Depends(get_admin_user)])
async def create_genre(session: SessionDep, name: str):
    genre = Genre(name=name)
    session.add(genre)
    session.commit()
    return JSONResponse(success_message, status_code=status.HTTP_201_CREATED)

@router.post('/show/add-genre/{show_id}', dependencies=[Depends(get_admin_user)])
async def add_genre(session: SessionDep, payload: AddGenre):
    show = await retrieve_single_show(session=session, show_id=payload.show_id)
    for genre in payload.genres:
        db_genre = session.exec(select(Genre).where(Genre.id == to_uuid4(genre))).first()
        if not db_genre:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"the genre you tried to add {genre} does not exist."
            )
        show.genres.append(db_genre)
    session.add(show)
    session.commit()
    return JSONResponse(success_message, status_code=status.HTTP_201_CREATED)

@router.post('/casts', dependencies=[Depends(get_admin_user)])
async def get_casts(session: SessionDep):
    casts = session.exec(select(Cast)).all()
    return casts    

@router.post('/create-cast', dependencies=[Depends(get_admin_user)])
async def create_cast(session: SessionDep, payload: CastPayload):
    cast = Cast(name=payload.name, profile_path=payload.profile_path)
    session.add(cast)
    session.commit()
    return JSONResponse(success_message, status_code=status.HTTP_201_CREATED)

@router.post('/add-cast/{show_id}', dependencies=[Depends(get_admin_user)])
async def add_cast(session: SessionDep, payload: AddCast):
    show = await retrieve_single_show(session=session, show_id=payload.show_id)
    for cast in payload.casts:
        db_cast = session.exec(select(Cast).where(Cast.id == to_uuid4(cast))).first()
        if not db_cast:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"The cast you tried to add {cast} was not found."
            )
        show.casts.append(db_cast)
    session.add(show)
    session.commit()
    return JSONResponse(success_message, status_code=status.HTTP_201_CREATED)

@router.put('/update-show/{show_id}', dependencies=[Depends(get_admin_user)])
async def update_show(session: SessionDep, show_id: str, show: ShowIn):
    show_to_update = session.exec(select(Show).where(Show.id == to_uuid4(show_id))).first()
    if not show_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The show you want to delete was not found",
            headers={"www-authentication": "bearer"}
        )
    show_to_update.title = show.title
    show_to_update.overview = show.overview
    show_to_update.poster_path = show.poster_path
    show_to_update.backdrop_path = show.backdrop_path
    show_to_update.release_date = show.release_date
    show_to_update.original_language = show.original_language
    show_to_update.tagline = show.tagline
    show_to_update.vote_average = show.vote_average
    show_to_update.vote_count = show.vote_count
    show_to_update.runtime = show.runtime

    session.add(show_to_update)
    session.commit()

    return JSONResponse(success_message, status_code=status.HTTP_201_CREATED)

@router.delete('/show/{show_id}', dependencies=[Depends(get_admin_user)])
async def delete_show(session: SessionDep, show_id: str):
    unwanted_show = session.exec(select(Show).where(Show.id == to_uuid4(show_id))).first()
    if not unwanted_show:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The show you want to delete was not found"
        )
    session.delete(unwanted_show)
    session.commit()

    return JSONResponse(success_message, status_code=status.HTTP_204_NO_CONTENT)

@router.post('/show/set-active/{show_id}', dependencies=[Depends(get_admin_user)])
async def set_show_active(session: SessionDep, show_id: str):
    show = await retrieve_single_show(session=session, show_id=show_id)
    show.is_active = True
    session.add(show)
    session.commit()

    return JSONResponse(success_message, status_code=status.HTTP_204_NO_CONTENT)
    
@router.post('/show/set-inactive/{show_id}', dependencies=[Depends(get_admin_user)])
async def set_show_inactive(session: SessionDep, show_id: str):
    show = await retrieve_single_show(session=session, show_id=show_id)
    booking = session.exec(select(Booking).where(Booking.show_id == show.id)).first()
    if booking:
        tzone = booking.show_time.tzinfo
        today = datetime.now(tzone)
        if booking.show_time > today:
            raise HTTPException(
                detail='Cannot set a show inactive, when that show has been booked for a future date',
                status_code=status.HTTP_400_BAD_REQUEST
            )
    del booking
    show.is_active = False
    session.add(show)
    session.commit()

@router.post('/show/set-time', dependencies=[Depends(get_admin_user)])
async def set_show_time(session: SessionDep, payload: ShowTimeIn):
    show = await retrieve_single_show(session=session, show_id=payload.show_id)
    if not show.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="To set a time for a show, that show must first be active"
        )
    show_id_uuid = to_uuid4(payload.show_id)
    # date = payload.show_date.date()
    # show_time = payload.show_date.time()
    time = ShowTime(show_id=show_id_uuid, show_time=payload.show_time)
    session.add(time)
    session.commit()

    return JSONResponse(success_message, status_code=status.HTTP_204_NO_CONTENT)

@router.delete('/show/delete-time/{time_id}', dependencies=[Depends(get_admin_user)])
async def delete_show_time(session: SessionDep, time_id: str):
    time = session.exec(select(ShowTime).where(ShowTime.id == to_uuid4(time_id))).first()
    if not time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='The showtime was not found'
        )
    booked_slot = session.exec(select(Booking).where(Booking.show_time == time.show_time)).first()
    if booked_slot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Cannot delete a time, when that time has already been booked'
        )
    del booked_slot
    session.delete(time)
    session.commit()

    return JSONResponse(success_message, status_code=status.HTTP_204_NO_CONTENT)


@router.delete('/show/cancel-booking/{booking_id}', dependencies=[Depends(get_admin_user)])
async def cancel_booking(session: SessionDep, booking_id: str):
    booking = session.exec(select(Booking).where(Booking.id == to_uuid4(booking_id))).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='The booking you want to cancel does not exist',
        )
    occupied_seats = session.exec(select(OccupiedSeat).where(OccupiedSeat.booking_id == booking.id)).all()
    session.delete(booking)
    session.delete(occupied_seats)
    session.commit()
    
    return JSONResponse('Deleted successfully', status_code=status.HTTP_204_NO_CONTENT)


@router.get('/dashboard', dependencies=[Depends(get_admin_user)])
async def dashboard(session: SessionDep):
    bookings = session.exec(select(Booking)).all()
    total_bookings = len(bookings)
    total_revenue = 0
    for booking in bookings:
        if booking.is_paid:
            total_revenue += booking.amount
    del bookings
    users = session.exec(select(User)).all()
    total_users = len(users)
    active_shows = session.exec(select(Show).where(Show.is_active == True)).all()
    del users

    response = {}
    response['total_bookings'] = total_bookings
    response['total_revenue'] = total_revenue
    response['total_user'] = total_users
    response['active_shows'] = active_shows

    return response

@router.get('/list-shows', dependencies=[Depends(get_admin_user)])
async def list_shows(session: SessionDep):
    response = []
    shows = session.exec(select(Show)).all()
    for show in shows:
        payload = {}
        payload['show_title'] = show.title

        show_times = session.exec(select(ShowTime).where(ShowTime.show_id == show.id)).all()
        
        for time in show_times:
            show_bookings = session.exec(select(Booking).where(Booking.show_id == show.id and Booking.show_time == time and Booking.is_paid == True)).all()
            total_bookings = len(show_bookings)
            earnings = 0

            for booking in show_bookings:
                earnings += booking.amount

            payload['show_time'] = time
            payload['total_bookings'] = total_bookings
            payload['earnings'] = earnings

            response.append(payload)
        
    return response

@router.get('/list-bookings', dependencies=[Depends(get_admin_user)])
async def list_bookings(session: SessionDep):
    bookings = session.exec(select(Booking)).all()
    response = []
    for booking in bookings:
        payload = {}
        payload['_id'] = booking.id
        user = session.exec(select(User).where(User.id == Booking.user_id)).one()
        show = await retrieve_single_show(session=session, show_id=str(Booking.show_id))
        booked_seats = session.exec(select(OccupiedSeat).where(OccupiedSeat.booking_id == Booking.id)).all()

        payload['user'] = {'name': user.firstname}
        payload['show'] = {
            '_id': show.id,
            'show': show,
            'show_date_time': booking.show_time,
            'show_price': show.price
        }
        payload['amount'] = booking.amount
        payload['booked_seats'] = booked_seats
        payload['is_paid'] = booking.is_paid

        response.append(payload)
    
    return response

        
        



    # create a special table that will help you store all the admin's details