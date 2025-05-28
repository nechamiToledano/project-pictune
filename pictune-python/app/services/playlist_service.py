import json
import os
import re
from typing import Dict, List
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

class Song(BaseModel):
    id: int
    transcript: str

# Load API key
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Create OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

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
        response = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        json_text = response.choices[0].message.content
        json_text = re.sub(r"```json\s*|\s*```", "", json_text).strip()
        return json.loads(json_text)
    except Exception as e:
        print("Error creating user-based playlist:", e)
        return {}
