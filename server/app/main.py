from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from api.main import api_router
from core.config import settings
from model import *
from sqlmodel import SQLModel, Session
from core.db import engine
from core.security import get_hashed_password
from dotenv import load_dotenv

import os
import json

from contextlib import asynccontextmanager

load_dotenv()

def initialiseDB():
    SQLModel.metadata.create_all(engine)
    admin_user = os.getenv('ADMIN_USER')
    if not admin_user:
        raise Exception('No admin user credentials')
    admin_user = json.loads(admin_user)
    password = get_hashed_password(admin_user['password'])

    with Session(engine) as session:
        user = User(
            firstname=admin_user['firstname'],
            lastname=admin_user['lastname'],
            username=admin_user['username'],
            email=admin_user['email'],
            hashed_password=password,
            is_admin=True
        )
        session.add(user)
        session.commit()

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
