from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List
import uuid
import json
import os
import shutil
from tempfile import mkdtemp
from threading import Thread
import time

import app
from app.services.audio_service import transcribe_audio
from app.services.playlist_service import generate_playlist_by_user_prompt
from app.services.video_creator_service import create_video_from_segments_with_settings

router = APIRouter()
task_status = {}

class Song(BaseModel):
    id: int
    transcript: str

    class Config:
        allow_population_by_field_name = True
        alias_generator = str.lower  

class TranscribeRequest(BaseModel):
    url: str
    
class PromptRequest(BaseModel):
    user_prompt: str
    songs: List[Song]
    
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )
     
@router.post("/transcribe_song")
async def transcribe_song_endpoint(request: TranscribeRequest):
    try:
        transcription = transcribe_audio(upload_url=request.url)
        return {
            "full_text": transcription["full_text"],
            "words": transcription["words"]
        }
    except Exception     as e:
        raise HTTPException(status_code=500, detail=f"שגיאה בתמלול: {str(e)}")

@router.post("/generate_playlist_by_prompt/")
async def generate_playlist_by_prompt_endpoint(request: PromptRequest):
    try:
        playlist = generate_playlist_by_user_prompt(request.user_prompt, request.songs)
        return playlist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating playlist by prompt: {str(e)}")

@router.post("/create-clip")
async def create_clip_async(
    settings: str = Form(...),
    songUrl: str = Form(...),
    mediaFiles: List[UploadFile] = File(default=[]),
):
    task_id = str(uuid.uuid4())
    task_status[task_id] = {"status": "pending"}

    temp_dir = mkdtemp(prefix="clip_")
    settings_path = os.path.join(temp_dir, "settings.json")
    with open(settings_path, "w", encoding="utf-8") as f:
        f.write(settings)

    media_paths = []
    for media in mediaFiles:
        dest_path = os.path.join(temp_dir, f"{uuid.uuid4()}_{media.filename}")
        with open(dest_path, "wb") as f:
            f.write(await media.read())
        media_paths.append(dest_path)

    def process_task():
        try:
            parsed_settings = json.loads(open(settings_path, encoding="utf-8").read())
            output_filename = f"{uuid.uuid4()}.mp4"
            output_path = os.path.join("temp_videos", output_filename)
            os.makedirs("temp_videos", exist_ok=True)
            create_video_from_segments_with_settings(
                segments=parsed_settings["words"],
                media_paths=media_paths,
                audio_url=songUrl,
                clip_settings=parsed_settings,
                output_path=output_path,
            )
            task_status[task_id] = {
                "status": "done",
                "video_url": f"/videos/{output_filename}"
            }

            # מחיקה אוטומטית של הקובץ לאחר חצי שעה
            def delete_later(path):
                time.sleep(1800)  # 30 דקות = 1800 שניות
                if os.path.exists(path):
                    os.remove(path)

            Thread(target=delete_later, args=(output_path,), daemon=True).start()

        except Exception as e:
            task_status[task_id] = {"status": "error", "message": str(e)}
        finally:
            shutil.rmtree(temp_dir)

    Thread(target=process_task).start()

    return {"task_id": task_id}

@router.get("/clip-status/{task_id}")
def get_clip_status(task_id: str):
    if task_id not in task_status:
        raise HTTPException(status_code=404, detail="Task ID not found")
    return task_status[task_id]

@router.get("/videos/{filename}")
async def get_video_file(filename: str):
    video_path = os.path.join("temp_videos", filename)
    if not os.path.exists(video_path):
        return JSONResponse({"error": "File not found"}, status_code=404)
    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename=filename,
        headers={"Cache-Control": "no-cache"}
    )

@router.get("/")
def root():
    return {"message": "API is running"}
