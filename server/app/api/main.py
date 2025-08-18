from fastapi import APIRouter

from api.routes import show, auth, admin

api_router = APIRouter()

api_router.include_router(show.router)
api_router.include_router(auth.router)
api_router.include_router(admin.router)
