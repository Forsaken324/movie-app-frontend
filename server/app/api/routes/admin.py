from typing import Annotated, Dict

from ..controllers.show_controllers import retrieve_single_show
from ..lib.helpers import to_uuid4
from model import AddCast, AddGenre, Cast, CastPayload, Genre, ShowIn, ShowTime, ShowTimeIn, User, Show

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
    

@router.post('/show/set-time', dependencies=[Depends(get_admin_user)])
async def set_show_time(session: SessionDep, payload: ShowTimeIn):
    show = await retrieve_single_show(session=session, show_id=payload.show_id)
    if not show.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="To set a time for a show, that show must first be active"
        )
    show_id_uuid = to_uuid4(payload.show_id)
    date = payload.show_date.date()
    show_time = payload.show_date.time()
    time = ShowTime(show_id=show_id_uuid, show_date=date, show_time=show_time)
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
    session.delete(time)
    session.commit()

    return JSONResponse(success_message, status_code=status.HTTP_204_NO_CONTENT)
