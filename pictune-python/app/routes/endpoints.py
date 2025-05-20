import json
import os
import shutil
from tempfile import mkdtemp
import uuid
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List

from app.services.audio_service import transcribe_audio
from app.services.playlist_service import generate_playlist_by_user_prompt
from app.services.video_creator_service import create_video_from_segments_with_settings

router = APIRouter()

class Song(BaseModel):
    id: int
    transcript: str

class TranscribeRequest(BaseModel):
    url: str

class TranscribeRequest(BaseModel):
    url: str  # קישור לקובץ MP3 ב-S3 למשל

@router.post("/transcribe_song/")
async def transcribe_song_endpoint(request: TranscribeRequest):
    print("URL received:", request.url)
    
    try:
        transcription = transcribe_audio(upload_url=request.url)
        return {
            "full_text": transcription["full_text"],  # תמלול מלא ומפוסק
            "words": transcription["words"]           # מילים עם חותמות זמן
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"שגיאה בתמלול: {str(e)}")
@router.post("/generate_playlist_by_prompt/")
async def generate_playlist_by_prompt_endpoint(user_prompt: str, songs: List[Song]):
    try:
        playlist = generate_playlist_by_user_prompt(user_prompt, songs)
        return playlist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating playlist by prompt: {str(e)}")
@router.post("/create-clip")
async def create_clip(
    settings: str = Form(...),
    songUrl: str = Form(...),
    mediaFiles: List[UploadFile] = File(default=[]),
):
    try:
        print(songUrl)
        parsed_settings = json.loads(settings)

        temp_dir = mkdtemp(prefix="clip_")
        media_paths = []
        for media in mediaFiles:
            filename = f"{uuid.uuid4()}_{media.filename}"
            dest_path = os.path.join(temp_dir, filename)
            with open(dest_path, "wb") as f:
                f.write(await media.read())
            media_paths.append(dest_path)

        segments = parsed_settings.get("words", [])
        if not segments:
            shutil.rmtree(temp_dir)
            return JSONResponse({"error": "Missing 'words' in settings"}, status_code=400)
        
        output_filename = f"{uuid.uuid4()}.mp4"
        output_dir = "temp_videos"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, output_filename)

        final_video_path = create_video_from_segments_with_settings(
            segments=segments,
            media_paths=media_paths,
            audio_url=songUrl,
            clip_settings=parsed_settings,
            output_path=output_path,
        )

        shutil.rmtree(temp_dir)

        return JSONResponse({"videoUrl": f"/videos/{output_filename}"})

    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)
@router.get("/")
def root():
    return {"message": "API is running"}