from fastapi import APIRouter

from api.routes import show, common

api_router = APIRouter()

api_router.include_router(show.router)
api_router.include_router(common.router)
