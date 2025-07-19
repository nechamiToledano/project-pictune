import os
import json
import re
from typing import Dict, List
from dotenv import load_dotenv
import google.generativeai as genai
from pydantic import BaseModel

class Song(BaseModel):
    id: int
    transcript: str

# Load API key
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create Gemini model
model = genai.GenerativeModel('gemini-pro')

def generate_playlist_by_user_prompt(user_prompt: str, songs: List[Song]) -> Dict:
    song_descriptions = "\n".join([f"{song.id}: {song.transcript}" for song in songs])

    prompt = f"""
יש ברשותך רשימת שירים עם מילותיהם:

{song_descriptions}

המשתמש ביקש ליצור פלייליסט לפי התיאור הבא:
"{user_prompt}"

בחר מתוך הרשימה רק את השירים שמתאימים ביותר לבקשה של המשתמש. החזר תשובה בפורמט JSON עם שם הפלייליסט, תיאור קצר, ורשימת מזהי שירים.

הפורמט המבוקש:
{{
  "Name": "שם הפלייליסט",
  "Description": "תיאור הפלייליסט",
  "Songs": [10, 13, 14]
}}
"""

    try:
        response = model.generate_content(prompt)
        json_text = response.text
        json_text = re.sub(r"```json\s*|\s*```", "", json_text).strip()
        return json.loads(json_text)
    except Exception as e:
        print("Error using Gemini to generate playlist:", e)
        return {}

