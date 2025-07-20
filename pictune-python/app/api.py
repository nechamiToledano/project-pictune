import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.endpoints import router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.requests import Request

def create_app():
    app = FastAPI()
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
            return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

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
