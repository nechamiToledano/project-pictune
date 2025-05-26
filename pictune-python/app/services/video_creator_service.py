import os
import requests
import uuid
import math
import shutil
import urllib
from moviepy import (
    AudioFileClip,
    VideoFileClip,
    ImageClip,
    TextClip,
    CompositeVideoClip,
    concatenate_videoclips,
    ColorClip
)
from moviepy.video.fx import FadeOut, FadeIn, Resize

import arabic_reshaper
from bidi.algorithm import get_display

def download_file(url: str, folder: str) -> str:
    filename = os.path.basename(urllib.parse.urlparse(url).path)
    if not filename:
        filename = "downloaded_file"
    filename = str(uuid.uuid4()) + "_" + filename
    local_path = os.path.join(folder, filename)

    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return local_path

def safely_close_clip(clip):
    try:
        if hasattr(clip, 'reader') and clip.reader:
            clip.reader.close()
        if hasattr(clip, 'audio') and hasattr(clip.audio, 'reader') and clip.audio.reader:
            clip.audio.reader.close_proc()
    except Exception as e:
        print(f"Warning while closing clip: {e}")
    finally:
        try:
            clip.close()
        except:
            pass

def create_animated_subtitle_clips(word_segments, clip_settings):
    subtitle_clips = []
    accumulated_text = ""
    max_length = clip_settings.get("maxTextLength", 35)

    font_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'fonts', 'ARIAL.ttf'))

    font_size = clip_settings.get("fontSize", 48)
    text_color = clip_settings.get("textColor", "white")
    text_position = clip_settings.get("textPosition", ("center", "bottom"))
    text_box_size = (1000, 80)
    animation = clip_settings.get("textAnimation", "fade")

    clip_start = None
    clip_end = None

    for i, segment in enumerate(word_segments):
        word = segment["text"].strip()
        start = segment["start"] / 1000.0
        end = segment["end"] / 1000.0

        if clip_start is None:
            clip_start = start

        new_text = accumulated_text + word + " "

        if len(new_text) <= max_length:
            accumulated_text = new_text
            clip_end = end
        else:
            reshaped_text = arabic_reshaper.reshape(accumulated_text.strip())
            bidi_text = get_display(reshaped_text)

            try:
                txt_clip = (
                    TextClip(
                        text=bidi_text,
                        font=font_path,
                        font_size=font_size,
                        color=text_color,
                        method="label",
                        size=text_box_size,
                        text_align="right",
                    )
                    .with_position(text_position)
                    .with_start(clip_start)
                    .with_duration(clip_end - clip_start)
                )

                if animation == "fade":
                    txt_clip = txt_clip.with_effects([FadeIn(0.3), FadeOut(0.3)])

                subtitle_clips.append(txt_clip)

            except Exception as e:
                print(f"\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d9\u05e6\u05d9\u05e8\u05ea \u05d8\u05e7\u05e1\u05d8 \u05d1\u05e9\u05d5\u05e8\u05d4 {i}: {e}")

            accumulated_text = word + " "
            clip_start = start
            clip_end = end

    if accumulated_text:
        reshaped_text = arabic_reshaper.reshape(accumulated_text.strip())
        bidi_text = get_display(reshaped_text)

        try:
            txt_clip = (
                TextClip(
                    text=bidi_text,
                    font=font_path,
                    font_size=font_size,
                    color=text_color,
                    method="label",
                    size=text_box_size,
                    text_align="right",
                )
                .with_position(text_position)
                .with_start(clip_start)
                .with_duration(clip_end - clip_start)
            )

            if animation == "fade":
                txt_clip = txt_clip.with_effects([FadeIn(0.3), FadeOut(0.3)])

            subtitle_clips.append(txt_clip)

        except Exception as e:
            print(f"\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d9\u05e6\u05d9\u05e8\u05ea \u05d4\u05d8\u05e7\u05e1\u05d8 \u05d4\u05d0\u05d7\u05e8\u05d5\u05df: {e}")

    return subtitle_clips

def create_video_from_segments_with_settings(
    segments,
    media_paths,
    audio_url,
    clip_settings: dict,
    output_path="final_video.mp4",
    background_height=720,
):
    temp_folder = "temp_assets"
    os.makedirs(temp_folder, exist_ok=True)
    temp_files = []
    temp_clips = []
    audio = None

    try:
        print("Downloading audio...")
        audio_path = download_file(audio_url, temp_folder)
        print(f"Audio downloaded to: {audio_path}")
        temp_files.append(audio_path)
        audio = AudioFileClip(audio_path)

        word_segments = segments.get("words", [])
        if not word_segments:
            raise ValueError("No words in segments")

        full_duration = word_segments[-1]["end"] / 1000.0
        print("Preparing media clips...")

        if not media_paths:
            raise ValueError("No media files provided")

        num_media = len(media_paths)
        duration_per_clip = full_duration / num_media

        for i, media_path in enumerate(media_paths):
            start = i * duration_per_clip
            end = min((i + 1) * duration_per_clip, full_duration)
            duration = end - start

            try:
                if media_path.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')):
                    clip = VideoFileClip(media_path).subclipped(0, duration).resized(height=background_height)
                else:
                    clip = ImageClip(media_path).with_duration(duration).resized(height=background_height)

                if clip_settings.get("zoomEffect", False):
                    clip = clip.with_effects([Resize(lambda t: 1 + 0.02 * t)])

                if duration > 2:
                    clip = clip.with_effects([FadeOut(1), FadeIn(1)])

                clip = clip.with_position("center").with_start(start)

                temp_clips.append(clip)

            except Exception as e:
                print(f"Failed to process media {media_path}: {e}")

        print("Generating subtitle clips...")
        subtitle_clips = create_animated_subtitle_clips(word_segments, clip_settings)

        print("Compositing and rendering video...")
        final = CompositeVideoClip(temp_clips + subtitle_clips, size=(1280, background_height)).with_audio(audio)

        video_quality = clip_settings.get("videoQuality", "medium")
        fps = clip_settings.get("framerate", 24)
        preset = {"low": "ultrafast", "medium": "medium", "high": "slow"}.get(video_quality, "medium")

        final.write_videofile(
            output_path,
            fps=fps,
            codec="libx264",
            audio_codec="aac",
            preset=preset,
            threads=4,
            logger="bar",
            temp_audiofile=os.path.join(temp_folder, "temp-audio.m4a"),
            remove_temp=True
        )

        return output_path

    finally:
        print("Cleaning up temporary files...")
        if audio:
            audio.close()
        for clip in temp_clips:
            safely_close_clip(clip)
        for file_path in temp_files:
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Couldn't delete {file_path}: {e}")
        if os.path.exists(temp_folder):
            try:
                shutil.rmtree(temp_folder)
            except Exception as e:
                print(f"Couldn't delete temp folder: {e}")
