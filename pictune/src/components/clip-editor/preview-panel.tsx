"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Play, Pause, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import WordTimeline from "./word-timeline"
import type { ClipSettings } from "./clip-editor"
import { MusicFile } from "@/store/slices/musicFilesSlice"

interface PreviewPanelProps {
  mediaFiles: File[]
  isVideo: boolean
  previewMode: boolean
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  currentTime: number
  setCurrentTime: (time: number) => void
  duration: number
  setDuration: (duration: number) => void
  settings: ClipSettings
  updateSetting: (key: string, value: any) => void
  selectedSong: MusicFile | null
  clipUrl?: string | null }

export default function PreviewPanel({
  mediaFiles,
  isVideo,
  previewMode,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  settings,
  selectedSong,
  clipUrl, // ✅ added
}: PreviewPanelProps) {
  const progressRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const previewTimerRef = useRef<number | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (clipUrl) {
      setVideoUrl(clipUrl)
      return
    }

    if (mediaFiles.length && isVideo) {
      const reader = new FileReader()
      reader.onload = () => {
        const blob = new Blob([reader.result as ArrayBuffer], { type: mediaFiles[0].type })
        const url = URL.createObjectURL(blob)
        setVideoUrl(url)
      }
      reader.readAsArrayBuffer(mediaFiles[0])
    } else {
      setVideoUrl(null)
    }
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [mediaFiles, isVideo, clipUrl]) // ✅ include clipUrl

  useEffect(() => {
    return () => {
      if (previewTimerRef.current !== null) {
        clearInterval(previewTimerRef.current)
      }
    }
  }, [])

  const togglePlayback = () => {
    if (isPlaying) {
      if (previewTimerRef.current !== null) {
        clearInterval(previewTimerRef.current)
        previewTimerRef.current = null
      }
      setIsPlaying(false)
      if (videoRef.current) videoRef.current.pause()
    } else {
      setIsPlaying(true)
      if (videoRef.current) {
        videoRef.current.play()
        return
      }
      previewTimerRef.current = window.setInterval(() => {
        let newTime = currentTime + 0.1
        if (newTime >= duration) {
          clearInterval(previewTimerRef.current!)
          previewTimerRef.current = null
          setIsPlaying(false)
          newTime = 0
        }
        setCurrentTime(newTime)
      }, 100)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = pos * duration
    setCurrentTime(newTime)
    if (videoRef.current) videoRef.current.currentTime = newTime
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getActiveWords = () => {
    if (!isPlaying) return settings.words
    return settings.words.filter(w => currentTime >= w.start && currentTime <= w.end)
  }

  const getTextStyleClasses = () => {
    const classes = []
    if (settings.textStyles.bold) classes.push("font-bold")
    if (settings.textStyles.italic) classes.push("italic")
    if (settings.textStyles.underline) classes.push("underline")
    return classes.join(" ")
  }

  return (
    <Card className="bg-gray-900/30 backdrop-blur-md border-gray-800/50 overflow-hidden shadow-xl">
      <div className="aspect-video bg-gray-950/50 flex items-center justify-center relative">
        {videoUrl ? (
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            controls={false}
            src={videoUrl}
            className="max-h-full"
            onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
            onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
            onEnded={() => setIsPlaying(false)}
          />
        ) : selectedSong ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/30 via-purple-900/30 to-blue-900/30">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center">
                <Music className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-xl font-medium text-white">{selectedSong.displayName}</h3>
              <p className="text-sm text-gray-400">Audio track selected</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-zinc-500">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center">
                <Music className="w-8 h-8 text-white/40" />
              </div>
            </div>
            <p>העלה קבצי מדיה או בחר שיר כדי להתחיל</p>
          </div>
        )}

        {(previewMode || isPlaying) && (mediaFiles.length > 0 || selectedSong || clipUrl) && (
          <div
            className={`absolute ${
              settings.textPosition === "top"
                ? "top-4"
                : settings.textPosition === "bottom"
                  ? "bottom-4"
                  : "top-1/2 transform -translate-y-1/2"
            } left-0 right-0 text-${settings.textAlign} px-4`}
          >
            <div
              className={`inline-block ${
                settings.animation === "fade"
                  ? "animate-fade-in"
                  : settings.animation === "slide"
                    ? "animate-slide-up"
                    : settings.animation === "zoom"
                      ? "animate-zoom-in"
                      : settings.animation === "bounce"
                        ? "animate-bounce"
                        : settings.animation === "pulse"
                          ? "animate-pulse"
                          : ""
              } ${getTextStyleClasses()}`}
              style={{
                fontSize: `${settings.fontSize}px`,
                color: settings.textColor,
                fontFamily: settings.fontFamily,
                textShadow: settings.textShadow ? "0 0 8px rgba(0,0,0,0.8)" : "none",
                backgroundColor: settings.showBackground ? settings.backgroundColor : "transparent",
                borderRadius: `${settings.borderRadius}px`,
                padding: `${settings.padding}px`,
                letterSpacing: `${settings.letterSpacing}px`,
                lineHeight: settings.lineHeight,
                textAlign: settings.textAlign,
              }}
            >
              {isPlaying
                ? getActiveWords().map((w) => w.text).join(" ")
                : settings.words.map((w) => w.text).join(" ")}
            </div>
          </div>
        )}

        {(mediaFiles.length > 0 || selectedSong || clipUrl) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayback}
              className="rounded-full w-16 h-16 bg-black/50 hover:bg-black/70 text-white border border-gray-700 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
          </div>
        )}
      </div>

      {(mediaFiles.length > 0 || selectedSong || clipUrl) && (
        <div className="p-4 border-t border-gray-800/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm">{formatTime(currentTime)}</span>
            <span className="text-white/80 text-sm">{formatTime(duration)}</span>
          </div>
          <div
            ref={progressRef}
            className="h-1.5 bg-gray-800 rounded-full mb-4 relative cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
        </div>
      )}

      <WordTimeline selectedSong={selectedSong} />
    </Card>
  )
}