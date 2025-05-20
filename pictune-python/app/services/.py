from moviepy import *

audio = AudioFileClip("a.mp3")
image = ImageClip("1.jpg").with_duration(audio.duration).resized(height=720)

video = image.with_audio(audio)
video.write_videofile("test.mp4", fps=24)
