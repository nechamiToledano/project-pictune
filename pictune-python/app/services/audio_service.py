import os
import requests
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def correct_lyrics(text: str) -> str:

    
    prompt = f"""
הטקסט הבא הוא תמלול של שיר בעברית. הוא עשוי להכיל טעויות כתיב, טעויות תחביר וגם מילים לא תקינות או מבולבלות.
תקן אותו לעברית תקנית, רהוטה, ומדויקת — כולל תיקון שיבושי הגייה או תמלול.
שמור על המקצב, הרגש והמשמעות של השיר, ואל תשנה את המבנה השירי (שורות, בתים). 
אם יש קטעים לא ברורים (כמו 'ארדיש'), נסה לנחש את הכוונה לפי ההקשר.
אל תוסיף מילים חדשות ואל תוריד שורות שלמות.

---
{text}
---
"""

    response = client.chat.completions.create(      
    model="gpt-4o-mini",  # או gpt-3.5-turbo/gpt-4 לפי מה שזמין לך
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
        'speech_model': 'nano',
        'punctuate': True,
        'format_text': True,
        'auto_chapters': False,
        'speaker_labels': False,
        'boost_param': 'high'

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
