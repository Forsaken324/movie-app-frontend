from sqlmodel import SQLModel, Session

from model import *
from db.db import engine

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def create_heroes():
    hero_1 = Hero(name="Deadpond", secret_name="Dive Wilson")
    hero_2 = Hero(name="Spider-Boy", secret_name="Pedro Parqueador")

    with Session(engine) as session:
        session.add(hero_1)
        session.add(hero_2)

        session.commit()
    # this is how it works underneath
    # session = Session(engine)
    # session.add(hero_1)
    # session.add(hero_2)

    # session.commit()
    # session.close()

def main():
    create_db_and_tables()
    create_heroes()

if __name__ == "__main__":
    main()