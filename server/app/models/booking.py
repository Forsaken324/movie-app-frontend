from sqlmodel import SQLModel, Field

class Booking(SQLModel, table=True):
    ...