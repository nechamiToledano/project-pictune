import json
import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
base_url = "https://api.assemblyai.com"

def transcribe_audio(upload_url: str) -> dict:
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
            return format_transcription_result(paragraphs)

        elif result['status'] == 'failed':
            print(f"[ERROR] Transcription failed: {result}")
            raise Exception("Transcription failed")

        elif result['status'] == 'error':
            raise RuntimeError(f"Error: {result['error']}")

        else:
            print(f"[INFO] Waiting... Status: {result['status']}")
            time.sleep(3)

def format_transcription_result(paragraphs_result):
    result = {
        "full_text": "",
        "words": []
    }

    for paragraph in paragraphs_result.get('paragraphs', []):
        paragraph_text = paragraph.get('text', '')
        result["full_text"] += paragraph_text + "\n\n"

        for word in paragraph.get('words', []):
            word_data = {
                "text": word.get('text', ''),
                "start": word.get('start'),
                "end": word.get('end'),
            }
            result["words"].append(word_data)

    return result


