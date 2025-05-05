from fastapi import FastAPI
from app.routes.endpoints import router

def create_app():
    app = FastAPI()
    app.include_router(router)
    return app
