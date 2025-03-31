"use client"

import { PlayCircle, PauseCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fetchImage, type MusicFile } from "@/store/slices/musicFilesSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"

interface SongArtworkProps {
  song: MusicFile
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  songUrl: string | null
}

export default function SongArtwork({ song, isPlaying, setIsPlaying, songUrl }: SongArtworkProps) {
  const dispatch = useDispatch<AppDispatch>()
  const imageUrl = useSelector((state: RootState) => state.musicFiles.images[song.s3Key])
  
  useEffect(() => {
    if (song.s3Key && !imageUrl) { // Avoid redundant requests
      dispatch(fetchImage(song.s3Key))
    }
  }, [dispatch, song.s3Key, imageUrl])
  

  const togglePlay = () => {
    if (!songUrl) return

    const audio = document.querySelector("audio")
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="aspect-square relative rounded-xl overflow-hidden bg-black/30 backdrop-blur-md shadow-2xl mb-6 group">
      {imageUrl ? (
        <img
        src={`${imageUrl?imageUrl:'height=56&width=56&text=🎵'}`}
        alt={song.fileName}
          width={600}
          height={600}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          Loading Image...
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className={cn(
            "rounded-full w-24 h-24 transition-all duration-300",
            isPlaying
              ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 shadow-xl"
              : "bg-black/50 backdrop-blur-md text-white hover:scale-105",
          )}
        >
          {isPlaying ? (
            <PauseCircle className="h-16 w-16 text-white" />
          ) : (
            <PlayCircle className="h-16 w-16 text-white" />
          )}
        </Button>
      </div>
    </div>
  )
}
