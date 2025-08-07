from sqlmodel import SQLModel, Session, select, or_

from model import *
from db.db import engine

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def create_heroes():

    with Session(engine) as session:
        team_preventers = Team(name='Preventers', headquaters='Sharp Tower')
        team_z_force = Team(name='Z-Force', headquaters='Sister Margaret\'s Bar')
        
        session.add(team_preventers)    
        session.add(team_z_force)

        session.commit()

        hero_1 = Hero(name="Deadpond", secret_name="Dive Wilson", team_id=team_preventers.id)
        hero_2 = Hero(name="Spider-Boy", secret_name="Pedro Parqueador", team_id=team_preventers.id)
        hero_3 = Hero(name="Ete iyak", secret_name="Ofonime Johnson", team_id=team_z_force.id)
        hero_4 = Hero(name="Red Cross", secret_name="Nsikak Ita")

        session.add(hero_1)
        session.add(hero_2)
        session.add(hero_3)
        session.add(hero_4)

        session.commit()

        # refresh to get the latest data from the database

        session.refresh(hero_1)
        session.refresh(hero_2)
        session.refresh(hero_3)
        session.refresh(hero_4)

        print("Created hero:", hero_1)
        print("Created hero:", hero_2)
        print("Created hero:", hero_3)
        print("Created hero:", hero_4)

def create_w_relationships():
    with Session(engine) as session:
        team_preventers = Team(name='Preventers', headquaters='Sharp Tower')
        team_z_force = Team(name='Z-Force', headquaters='Sister Margaret\'s Bar')
        
        hero_1 = Hero(name="Deadpond", secret_name="Dive Wilson", team=team_preventers)
        hero_2 = Hero(name="Spider-Boy", secret_name="Pedro Parqueador", team=team_preventers)
        hero_3 = Hero(name="Ete iyak", secret_name="Ofonime Johnson", team=team_z_force)
        hero_4 = Hero(name="Red Cross", secret_name="Nsikak Ita")

        session.add(hero_1)
        session.add(hero_2)
        session.add(hero_3)
        session.add(hero_4)
        
        session.commit()
        session.refresh(hero_1)
        session.refresh(hero_2)
        session.refresh(hero_3)
        session.refresh(hero_4)

        print("Created hero:", hero_1)
        print("Created hero:", hero_2)
        print("Created hero:", hero_3)
        print("Created hero:", hero_4)

def select_heroes():
    with Session(engine) as session:
        results = session.exec(select(Hero)).all()
        print(results)

def select_related_heroes():
    with Session(engine) as session:
        statement = select(Hero, Team).where(Hero.team_id == Team.id)

def select_w_join():
    with Session(engine) as session:
        results = session.exec(select(Hero, Team).join(Team))
        for hero, team in results:
            print("Hero:", hero, "Team:", team)

def select_w_ljoin():
    with Session(engine) as session:
        results = session.exec(select(Hero, Team).join(Team, isouter=True))
        for hero, team in results:
            print("Hero:", hero, "Team:", team)

def select_specific_hero(hero_name: str):
    with Session(engine) as session:
        results = session.exec(select(Hero).where(Hero.name == hero_name)).all()
        print(results)

def select_hero_or():
    with Session(engine) as session:
        results = session.exec(select(Hero).where(or_(Hero.age <= 35, Hero.age > 90)))
        for hero, team in results:
            print("Hero:", hero, "Team:", team)

def main():
    create_db_and_tables()
    create_heroes()
    select_related_heroes()
    # select_specific_hero('Deadpond')
    # select_hero_or()

if __name__ == "__main__":
    main()