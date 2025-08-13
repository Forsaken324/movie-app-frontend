from fastapi import FastAPI, status
from api.main import api_router
from core.config import settings
from models.model import *
from sqlmodel import SQLModel
from core.db import engine

def initialiseDB():
    SQLModel.metadata.create_all(engine)

app = FastAPI(
    title=settings.PROJECT_NAME
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    initialiseDB()
