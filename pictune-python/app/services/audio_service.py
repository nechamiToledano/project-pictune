import json
import os
import time
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

base_url = "https://api.assemblyai.com"
client = OpenAI(api_key=OPENAI_API_KEY)

def transcribe_audio(upload_url: str) -> str:
    print(f"[INFO] Sending audio to AssemblyAI: {upload_url}")

    headers = {
        'authorization': ASSEMBLYAI_API_KEY,
        'content-type': 'application/json'
    }

    json_data = {
        "audio_url": upload_url,
        "speech_model": "nano",
        "language_code": "he",
        "punctuate": True,
        "format_text": True
    }

    url = base_url + "/v2/transcript"
    response = requests.post(url, json=json_data, headers=headers)
    response.raise_for_status()
    transcript_id = response.json()['id']
    polling_endpoint = f"{base_url}/v2/transcript/{transcript_id}"

    while True:
        result = requests.get(polling_endpoint, headers=headers).json()

        if result['status'] == 'completed':
            paragraphs_url = f"{base_url}/v2/transcript/{transcript_id}/paragraphs"
            paragraphs = requests.get(paragraphs_url, headers=headers).json()
            return extract_full_text(paragraphs)

        elif result['status'] == 'failed':
            print(f"[ERROR] Transcription failed: {result}")
            raise Exception("Transcription failed")

        elif result['status'] == 'error':
            raise RuntimeError(f"Error: {result['error']}")

        else:
            print(f"[INFO] Waiting... Status: {result['status']}")
            time.sleep(3)

def extract_full_text(paragraphs_result) -> str:
    return "\n\n".join([p.get('text', '') for p in paragraphs_result.get('paragraphs', [])])

def correct_text_with_gpt(full_text: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that formats and corrects Hebrew transcripts."},
            {"role": "user", "content": f"""הטקסט הבא הוא תמלול גולמי של שיר, המכיל שגיאות הקלדה, חוסר ניקוד, חזרות וטעויות בהברות.

המשימה שלך: לתקן את המילים כך שיהיו תקניות וקיימות בשפה העברית, לשמר את המקצב והמוזיקליות המקורית ככל האפשר, ולחלק את השיר למקטעים לפי מבנה שירי ברור (פזמון, בתים, מעבר). אין להוסיף הקדמה, הסבר או טקסט שאינו חלק מהשיר.

החזר אותו כתמלול לשיר:
{full_text}"""}
        ],
        temperature=0.2
    )
    return response.choices[0].message.content.strip()
