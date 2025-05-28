import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
base_url = "https://api.assemblyai.com"

def get_paragraphs(transcript_id):
    url = f"{base_url}/v2/transcript/{transcript_id}/paragraphs"
    headers = {
        'authorization': ASSEMBLYAI_API_KEY,
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    return data.get('paragraphs', [])

def paragraphs_to_text(paragraphs):
    # מחזיר טקסט עם רווח שורה כפול בין פסקאות
    return "\n\n".join(p['text'] for p in paragraphs)

def words_to_segments(words):
    # מחזיר רשימת סגמנטים (start_sec, end_sec, text) לפי המילים עם חותמות זמן
    segments = []
    if not words:
        return segments
    
    for w in words:
        start = w['start'] / 1000  # ממילישניות לשניות
        end = w['end'] / 1000
        text = w['text']
        segments.append((start, end, text))
    return segments

def transcribe_audio(upload_url: str):
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
        "format_text": True,
    }

    url = base_url + "/v2/transcript"
    response = requests.post(url, json=json_data, headers=headers)
    if response.status_code != 200:
        try:
            print(response.json()['error'])
        except Exception:
            print(response.status_code, response.text, response.url)
        response.raise_for_status()
    
    transcript_id = response.json()['id']
    polling_endpoint = f"{base_url}/v2/transcript/{transcript_id}"

    while True:
        result = requests.get(polling_endpoint, headers=headers).json()

        if result['status'] == 'completed':
            full_text = result.get('text', '')

            # מילים עם זמנים
            words = []
            if 'words' in result:
                words = result['words']
            elif 'utterances' in result:
                for utt in result['utterances']:
                    words.extend(utt.get('words', []))

            # פסקאות
            paragraphs = get_paragraphs(transcript_id)

            # טקסט מסודר לפי פסקאות
            text_with_paragraphs = paragraphs_to_text(paragraphs)

            # סגמנטים של מילים עם חותמות זמן
            segments = words_to_segments(words)

            return {
                "full_text": text_with_paragraphs,
                "words": segments
            }
        
        elif result['status'] == 'failed':
            print(f"[ERROR] Transcription failed: {result}")
            raise Exception("Transcription failed")

        elif result['status'] == 'error':
            raise RuntimeError(f"Error: {result['error']}")

        else:
            print(f"[INFO] Waiting... Status: {result['status']}")
            time.sleep(3)


print(transcribe_audio("https://pictune-files-testpnoren.s3.amazonaws.com/b8d5736f-babc-45ea-adbd-845d73239e5f.mp3?AWSAccessKeyId=AKIA54WIFXOGIK3FS4C4&Expires=1748474573&Signature=zHEfzHtDCO0A9Rq88mu8apBNbA0%3D"))