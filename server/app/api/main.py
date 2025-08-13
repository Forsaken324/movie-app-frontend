from fastapi import APIRouter

from api.routes import show

api_router = APIRouter()

api_router.include_router(show.router)