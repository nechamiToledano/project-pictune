"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InfoIcon, PlayCircle, PauseCircle, Music4, Play, Pause } from "lucide-react" 
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { fetchImage, type MusicFile } from "@/store/slices/musicFilesSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { Badge } from "@/components/ui/badge"

interface MusicCardProps {
  song: MusicFile
  index: number
  isPlaying: boolean
  onPlayPause: () => void
  isCompact?: boolean // הוספת הפרופ החדש
}

export default function MusicCard({ song, index, isPlaying, onPlayPause, isCompact }: MusicCardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const imageUrl = useSelector((state: RootState) => state.musicFiles.images[song.s3Key])

  useEffect(() => {
    if (song.s3Key && !imageUrl) {
      // Avoid redundant requests
      dispatch(fetchImage(song.s3Key))
    }
  }, [dispatch, song.s3Key, imageUrl])

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // --- תצוגת COMPACT ---
  if (isCompact) {
    return (
      <Card className="bg-black/30 border border-gray-800 text-white rounded-lg hover:bg-black/50 transition-colors duration-200">
        <CardContent className="p-3 flex items-center gap-3">
          {/* כפתור הפעלה/השהיה */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full flex-shrink-0 text-white hover:bg-white/10"
            onClick={onPlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* תמונה ממוזערת / אייקון */}
          <div className="flex-shrink-0 h-8 w-8 rounded-md overflow-hidden bg-gray-900/50 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Album Art"
                className="object-cover w-full h-full"
              />
            ) : (
              <Music4 className="h-4 w-4 text-white/20" /> 
            )}
          </div>

          {/* מידע על השיר */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate text-white">{song.fileName}</h3>
            <p className="text-xs text-gray-400 truncate">
              {formatFileSize(song.size)} • {formatDate(song.uploadedAt)}
            </p>
          </div>

          {/* כפתורי פעולה נוספים (לייק, פרטים) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* לדוגמה: כפתור לייק */}
            {/* <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-white/10">
              <Heart className="h-4 w-4" />
            </Button> */}
            {/* כפתור פרטים */}
            <Button
                asChild
                variant="ghost"
                size="sm"
                className="bg-transparent hover:bg-white/10 text-white transition-all duration-300 h-7 px-2"
              >
                <Link to={`/music/${song.id}`} className="flex items-center justify-center gap-1">
                  <InfoIcon className="h-3 w-3" />
                </Link>
              </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // --- תצוגת GRID (התצוגה המקורית) ---
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="border border-gray-800 bg-gray-900/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 h-full relative z-10 overflow-hidden">
        {/* Top gradient bar */}
        <div
          className={cn(
            "h-1 w-full",
            index % 3 === 0
              ? "bg-gradient-to-r from-red-500 to-blue-500"
              : index % 3 === 1
                ? "bg-gradient-to-r from-blue-500 to-red-500"
                : "bg-gradient-to-r from-purple-500 to-red-500",
          )}
        />

        <CardContent className="p-3">
          <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-md shadow-md group-hover:shadow-lg transition-all duration-300">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={song.fileName}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/30 via-purple-900/30 to-blue-900/30">
                <Music4 className="h-40 w-30 text-white/30" />
              </div>
            )}
            {/* Overlay gradient */}
            <div
              className={cn(
                "absolute inset-0 opacity-30",
                index % 3 === 0
                  ? "bg-gradient-to-br from-red-500/20 to-blue-500/20"
                  : index % 3 === 1
                    ? "bg-gradient-to-br from-blue-500/20 to-red-500/20"
                    : "bg-gradient-to-br from-purple-500/20 to-red-500/20",
              )}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12 transition-all duration-300",
                  isPlaying
                    ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 shadow-xl"
                    : "bg-black/50 backdrop-blur-md text-white hover:scale-105",
                )}
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <PauseCircle className="h-8 w-8 text-white" />
                ) : (
                  <PlayCircle className="h-8 w-8 text-white" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-medium text-sm text-white line-clamp-1">{song.fileName}</h3>

            <div className="flex justify-between items-center text-xs text-gray-400">
              <Badge variant="outline" className="text-xs bg-gray-800/50 text-gray-300 border-gray-700">
                {formatFileSize(song.size)}
              </Badge>
              <span className="text-xs text-gray-500">{formatDate(song.uploadedAt)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full bg-gradient-to-r from-red-600/10 to-blue-600/10 hover:from-red-700/20 hover:to-blue-700/20 text-white transition-all duration-300 h-8"
          >
            <Link to={`/music/${song.id}`} className="flex items-center justify-center gap-1">
              <InfoIcon className="h-3 w-3" /> Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}