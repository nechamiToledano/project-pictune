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

def create_video_from_segments_with_settings(
    segments,
    media_paths,
    audio_url,
    clip_settings: dict,
    output_path="final_video.mp4",
    font_default_path="C:/Windows/Fonts/Arial.ttf",
    background_height=720,
):
    temp_folder = "temp_assets"
    os.makedirs(temp_folder, exist_ok=True)
    temp_files = []
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
        print("Preparing background clips...")
        background_clips = []
        num_media = len(media_paths)

        use_video_background = clip_settings.get("showBackground", False)
        bg_color = clip_settings.get("backgroundColor", "black")
        bg_opacity = clip_settings.get("backgroundOpacity", 1.0)

        if use_video_background and media_paths:
            print("Using video background")
            bg_video = VideoFileClip(media_paths[0]).without_audio()
            if bg_video.duration < full_duration:
                loops = math.ceil(full_duration / bg_video.duration)
                bg_video = concatenate_videoclips([bg_video] * loops).subclipped(0, full_duration)
            else:
                bg_video = bg_video.subclipped(0, full_duration)
            bg_video = bg_video.resized(height=background_height).with_position("center")
            background_clips.append(bg_video)
        else:
            print("Using color background")
            color_clip = ColorClip(size=(1280, background_height), color=bg_color)
            color_clip = color_clip.with_duration(full_duration).with_opacity(bg_opacity)
            background_clips.append(color_clip)

            for i, segment in enumerate(word_segments):
                start = segment["start"] / 1000.0
                end = segment["end"] / 1000.0
                duration = end - start
                if duration <= 0:
                    print(f"Skipping segment with non-positive duration: {segment}")
                    continue
                media_index = i % num_media if num_media > 0 else 0
                img_path = media_paths[media_index] if media_paths else None
                if img_path:
                    visual = (
                        ImageClip(img_path)
                        .with_duration(duration)
                        .resized(height=background_height)
                        .with_position("center")
                        .with_start(start)
                    )
                    background_clips.append(visual)

        print("Generating subtitle clips...")
        subtitle_clips = []
        font_path = clip_settings.get("fontFamily", font_default_path)
        font_size = clip_settings.get("fontSize", 48)
        text_color = clip_settings.get("textColor", "white")
        text_position = clip_settings.get("textPosition", ("center", "bottom"))
        text_box_size = (1200, 150)
        text_align = clip_settings.get("textAlign", "center")

        for segment in word_segments:
            start = segment["start"] / 1000.0
            end = segment["end"] / 1000.0
            duration = end - start
            word = segment["text"].strip()
            hebrew_text = word[::-1] if clip_settings.get("autoSubtitles", False) else word

            try:
                txt_clip = (
                    TextClip(
                        text=hebrew_text,
                        font=font_path,
                        fontsize=font_size,
                        color=text_color,
                        method="caption",
                        size=text_box_size,
                        align=text_align,
                    )
                    .with_position(text_position)
                    .with_duration(duration)
                    .with_start(start)
                )
                subtitle_clips.append(txt_clip)
            except Exception as e:
                print(f"Error creating text clip for '{word}': {e}")

        print("Compositing final video clip...")
        final_clip = CompositeVideoClip(background_clips + subtitle_clips, size=(1280, background_height))
        final_clip = final_clip.with_audio(audio)

        video_quality = clip_settings.get("videoQuality", "medium")
        fps = clip_settings.get("framerate", 24)
        prewith_map = {"low": "ultrafast", "medium": "medium", "high": "slow"}
        preset = prewith_map.get(video_quality, "medium")

        print("Rendering video...")
        final_clip.write_videofile(
            output_path,
            fps=fps,
            codec="libx264",
            audio_codec="aac",
            preset=preset,
            threads=4,
            logger="bar",
        )

        return output_path

    finally:
        print("Cleaning up temporary files...")
        if audio:
            audio.close()
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
