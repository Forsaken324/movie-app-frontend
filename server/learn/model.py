from sqlmodel import Relationship, SQLModel, Relationship, Field, create_engine

class Team(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    headquaters: str = Field(max_length=256)

    heroes: list["Hero"] = Relationship(back_populates="team")

class Hero(SQLModel, table=True): # table=True tells SQLModel that it is a table model
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True) # creates an index for the table.
    secret_name: str
    age: int | None = None
    team_id: int | None = Field(default=None, foreign_key="team.id")
    team: Team | None = Relationship(back_populates="heroes") # we use heroes, as it is the hero tables attribute that has the relationship with the Hero table here, likewise for team also


# build a data extraction engine, where you scrape data from a site, and store it in a database, make use of beautiful soup and sqlmodel