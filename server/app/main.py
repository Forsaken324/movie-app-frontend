from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
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

origins = [
    'http://localhost:5173',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# @app.on_event("startup")
# def on_startup():
#     initialiseDB() this is deprecated.
