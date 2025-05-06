"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { fetchMusicFileById, fetchMusicFileUrl } from "@/store/slices/musicFilesSlice"
import type { AppDispatch, RootState } from "@/store/store"
import Background from "./Background"
import SongArtwork from "@/components/SongArtwork"
import SongActions from "@/components/SongActions"
import SongInfo from "@/components/SongInfo"
import SongLyrics from "@/components/SongLyrics"
import AddToPlaylistDialog from "@/components/Add-to-playlist-dialog"

export default function SongDetails() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { selectedFile: song, songUrl, loading, error } = useSelector((state: RootState) => state.musicFiles)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchMusicFileById(Number(id)))
      dispatch(fetchMusicFileUrl(Number(id))) // Fetch S3 pre-signed URL
    }
  }, [id, dispatch])

  useEffect(() => {
    if (songUrl) {
      const audio = new Audio(songUrl)
      audioRef.current = audio

      audio.addEventListener("timeupdate", updateProgress)
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration)
      })
      audio.addEventListener("ended", () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })

      return () => {
        audio.pause()
        audio.removeEventListener("timeupdate", updateProgress)
        audio.removeEventListener("loadedmetadata", () => {})
        audio.removeEventListener("ended", () => {})
      }
    }
  }, [songUrl])

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width

    audioRef.current.currentTime = pos * audioRef.current.duration
    setCurrentTime(audioRef.current.currentTime)
  }

  const downloadSong = () => {
    if (!song) return

    // Create a temporary anchor element
    const a = document.createElement("a")
    a.href = song.s3Key
    a.download = song.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin">
            <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          Loading song details...
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl max-w-md text-center border border-gray-800">
          <div className="text-red-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Song</h2>
          <p className="text-gray-400">{error}</p>
          <Button
            onClick={() => navigate("/music")}
            className="mt-4 bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
          >
            Back to Music
          </Button>
        </div>
      </div>
    )

  if (!song)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl max-w-md text-center border border-gray-800">
          <div className="text-yellow-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Song Not Found</h2>
          <p className="text-gray-400">The song you're looking for could not be found.</p>
          <Button
            onClick={() => navigate("/music")}
            className="mt-4 bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
          >
            Back to Music
          </Button>
        </div>
      </div>
    )

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Background />

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen mt-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex-1 flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Left Column - Artwork and Controls */}
            <div className="w-full md:w-1/2 max-w-md">
              <SongArtwork song={song} isPlaying={isPlaying} setIsPlaying={setIsPlaying} songUrl={songUrl} />

              <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 mb-6 border border-gray-800">
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

                <div className="flex justify-center gap-4">
                  <SongActions song={song} />
                  <AddToPlaylistDialog
                    song={song}
                    trigger={
                      <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                      </Button>
                    }
                  />
                </div>
              </div>

              <SongInfo song={song} />
            </div>

            {/* Right Column - Details and Lyrics */}
            <div className="w-full md:w-1/2 text-white">
              <h1 className="text-4xl font-bold mb-2">{song.fileName}</h1>
              <p className="text-white/70 mb-6">Enjoy your music with our enhanced audio player</p>

              <div className="mb-8">
          
                {/* Integrated SongLyrics component */}
                <SongLyrics songId={song.id} />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white backdrop-blur-sm"
                size="lg"
                onClick={downloadSong}
              >
                <Download className="mr-2 h-5 w-5" /> Download Song
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
