from sqlmodel import SQLModel, Relationship, Field, create_engine

class Hero(SQLModel, table=True): # table=True tells SQLModel that it is a table model
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True) # creates an index for the table.
    secret_name: str
    age: int | None = None

