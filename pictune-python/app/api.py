import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.endpoints import router
from fastapi.middleware.cors import CORSMiddleware

def create_app():
    app = FastAPI()
    app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # לא להפעיל כך בפרודקשן!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
        )

    os.makedirs("temp_videos", exist_ok=True) 
    app.mount("/videos", StaticFiles(directory="temp_videos"), name="videos")
    app.include_router(router)
    return app
