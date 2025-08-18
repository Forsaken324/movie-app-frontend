from fastapi import FastAPI, status
from api.main import api_router
from core.config import settings
from model import *
from sqlmodel import SQLModel
from core.db import engine

from contextlib import asynccontextmanager

def initialiseDB():
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    initialiseDB()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# @app.on_event("startup")
# def on_startup():
#     initialiseDB() this is deprecated.
