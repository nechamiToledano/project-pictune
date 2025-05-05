import os
import requests
from dotenv import load_dotenv
import openai


load_dotenv()

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
openai.api_key = os.getenv("OPENAI_API_KEY")
def correct_lyrics(text: str) -> str:

    prompt = f"""
הטקסט הבא הוא תמלול של שיר בעברית. הוא עשוי להכיל טעויות כתיב, טעויות תחביר וגם מילים לא תקינות או לא מתאימות. 
תקן אותו לעברית תקנית, זורמת, ומדויקת — כולל תיקון מילים שגויות או לא תקינות ").
שמור על המשקל, הרגש והמשמעות של השיר, ואל תשנה את המבנה השירי (שורות, בתים). אל תוסיף מילים חדשות ואל תוריד שורות שלמות.

---
{text}
---
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "אתה עורך שירים בעברית באופן שמכבד את המקצב, הרגש והמשמעות."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
        max_tokens=1000
    )

    return response["choices"][0]["message"]["content"]


def transcribe_audio(upload_url: str) -> str:
    headers = {
        'authorization': ASSEMBLYAI_API_KEY,
        'content-type': 'application/json'
    }
    json_data = {
        'audio_url': upload_url,
        'language_code': 'he',
        'speech_model': 'nano'
    }
    response = requests.post('https://api.assemblyai.com/v2/transcript', headers=headers, json=json_data)
    response.raise_for_status()
    transcript_id = response.json()['id']
    while True:
        check_response = requests.get(f'https://api.assemblyai.com/v2/transcript/{transcript_id}', headers=headers)
        check_response.raise_for_status()
        status = check_response.json()['status']
        if status == 'completed':
            transcription=correct_lyrics(check_response.json()['text'])
            return transcription
        elif status == 'failed':
            
            raise Exception('Transcription failed')
transcribe_audio("https://pictune-files-testpnoren.s3.us-east-1.amazonaws.com/181c3dc4-67f2-4c98-a2da-f2f1669242de.mp3")
