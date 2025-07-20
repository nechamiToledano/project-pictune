"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/LoadingSpinner"
import {  Play, Pause, AlertTriangle, Music4 } from "lucide-react"
import { fetchImage, fetchMusicFileById, fetchMusicFileUrl } from "@/store/slices/musicFilesSlice"
import type { AppDispatch, RootState } from "@/store/store"
import Background from "../components/Background"
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
      // Clean up any existing audio element
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current.load()
      }

      // Create new audio element
      const audio = new Audio(songUrl)
      audioRef.current = audio

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
      }

      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
      }

      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleEnded)

      return () => {
        audio.pause()
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [songUrl])

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

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
      })
    }
    setIsPlaying(!isPlaying)
  }

  const imageUrl = useSelector((state: RootState) => state.musicFiles.images[song?.s3Key || ""])

  useEffect(() => {
    console.log(imageUrl)
    if (song?.s3Key && !imageUrl) {
      dispatch(fetchImage(song.s3Key))
    }
  }, [dispatch, song?.s3Key, imageUrl])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <LoadingSpinner text="Loading Song..." size="lg" />
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl max-w-md text-center border border-gray-800/50 shadow-xl"
          >
            <div className="bg-red-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Error Loading Song</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => dispatch(fetchMusicFileById(Number(id)))}
                className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/music")}
                variant="outline"
                className="border-gray-700 text-white hover:bg-white/10"
              >
                Back to Music
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-red-500/5 to-blue-500/5"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl max-w-md text-center border border-gray-800/50 shadow-xl"
          >
            <div className="bg-yellow-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Music4 className="h-10 w-10 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Song Not Found</h2>
            <p className="text-gray-400 mb-6">The song you're looking for could not be found.</p>
            <Button
              onClick={() => navigate("/music")}
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
            >
              Back to Music
            </Button>
          </motion.div>
        </div>

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-red-500/5 to-blue-500/5"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Background />

      {/* Back to All Music Button */}
      <div className="relative z-20 container mx-auto px-4 pt-8 flex flex-col">
        <Button
          variant="outline"
          className="w-fit mb-6 border-gray-700 text-white hover:bg-white/10"
          onClick={() => navigate("/music")}
        >
          ← Back to All Music
        </Button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen mt-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex-1 flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Left Column - Artwork and Controls */}
            <div className="w-full md:w-1/2 max-w-md">
              <div className="relative aspect-square bg-gray-900/30 backdrop-blur-md rounded-xl overflow-hidden mb-6 border border-gray-800">
              {imageUrl ? (
              <img
                src={imageUrl }
                alt={song.displayName}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/30 via-purple-900/30 to-blue-900/30">
                <Music4 className="h-40 w-30 text-white/30" />
              </div>
            )}

                {/* Play/Pause Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={togglePlayback}
                    className="rounded-full w-16 h-16 bg-black/50 hover:bg-black/70 text-white border border-gray-700"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-md rounded-xl p-4 mb-6 border border-gray-800">
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
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                {song.displayName}
              </h1>
              <p className="text-white/70 mb-6">Enjoy your music with our enhanced audio player</p>

              <div className="mb-8">
                {/* Integrated SongLyrics component */}
                <SongLyrics songId={song.id} currentTime={currentTime} isPlaying={isPlaying} duration={duration} />
              </div>

           
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
