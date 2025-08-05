from sqlmodel import SQLModel, Session, select, or_

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

        print('Hero 1', hero_1)
        print('Hero_2', hero_2)

        session.commit()

        print('Hero 1', hero_1)
        print('Hero_2', hero_2)

        # refresh to get the latest data from the database

        session.refresh(hero_1)
        session.refresh(hero_2)

    # this is how it works underneath
    # session = Session(engine)
    # session.add(hero_1)
    # session.add(hero_2)

    # session.commit()
    # session.close()

def select_heroes():
    with Session(engine) as session:
        results = session.exec(select(Hero)).all()
        print(results)

def select_specific_hero(hero_name: str):
    with Session(engine) as session:
        results = session.exec(select(Hero).where(Hero.name == hero_name)).all()
        print(results)

def select_hero_or():
    with Session(engine) as session:
        results = session.exec(select(Hero).where(or_(Hero.age <= 35, Hero.age > 90))).all()
        print(results)

def main():
    create_db_and_tables()
    create_heroes()
    select_specific_hero('Deadpond')
    select_hero_or()

if __name__ == "__main__":
    main()