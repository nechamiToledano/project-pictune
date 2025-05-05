from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from app.services.audio_service import transcribe_audio
from app.services.playlist_service import generate_playlist_by_user_prompt

router = APIRouter()

class Song(BaseModel):
    id: int
    transcript: str

@router.post("/transcribe_song/")
async def transcribe_song_endpoint(url:str):
    try:
        # נניח שאתה שולח URL ולא קובץ - אתה יכול לשנות את הקלט בהתאם
        transcription = transcribe_audio(url)
        return {"transcription": transcription}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error transcribing song: {str(e)}")

@router.post("/generate_playlist_by_prompt/")
async def generate_playlist_by_prompt_endpoint(user_prompt: str, songs: List[Song]):
    try:
        playlist = generate_playlist_by_user_prompt(user_prompt, songs)
        return playlist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating playlist by prompt: {str(e)}")
