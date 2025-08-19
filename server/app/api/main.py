from fastapi import APIRouter

from api.routes import show, auth, admin, app


api_router = APIRouter()

api_router.include_router(show.router)
api_router.include_router(auth.router)
api_router.include_router(admin.router)
api_router.include_router(app.router)
