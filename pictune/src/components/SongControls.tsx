"use client"

import type React from "react"

import { PauseCircle, PlayCircle } from "lucide-react"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SongControlsProps {
  songUrl: string
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SongControls({ songUrl, isPlaying, setIsPlaying }: SongControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (songUrl) {
      audioRef.current = new Audio(songUrl)

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [songUrl])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex gap-4 mt-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className={cn(
          "rounded-full w-12 h-12 transition-all duration-300",
          isPlaying
            ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 shadow-xl"
            : "bg-black/50 backdrop-blur-md text-white hover:scale-105",
        )}
      >
        {isPlaying ? <PauseCircle className="h-6 w-6 text-white" /> : <PlayCircle className="h-6 w-6 text-white" />}
      </Button>
    </div>
  )
}

