from sqlmodel import Session, select
from models.model import Show
from db.db import engine

async def retrieve_shows():
    with Session(engine) as session:
        shows = session.exec(select(Show)).all()
        return shows
    
async def retrieve_single_show(show_id: int):
    with Session(engine) as session:
        show = session.exec(select(Show).where(Show.id == show_id)).all()
        return show    
