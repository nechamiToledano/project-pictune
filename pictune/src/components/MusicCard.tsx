"use client"

import { useEffect} from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InfoIcon, PlayCircle, PauseCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { fetchImage, type MusicFile } from "@/store/slices/musicFilesSlice"
import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"

interface MusicCardProps {
  song: MusicFile
  index: number
  isPlaying: boolean
  onPlayPause: () => void
}

export default function MusicCard({ song, index, isPlaying, onPlayPause }: MusicCardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const imageUrl = useSelector((state: RootState) => state.musicFiles.images[song.s3Key])
  
  useEffect(() => {
    if (song.s3Key && !imageUrl) { // Avoid redundant requests
      dispatch(fetchImage(song.s3Key))
    }
  }, [dispatch, song.s3Key, imageUrl])
  return (
  
    
    <motion.div
      className="relative rounded-xl overflow-hidden h-full group"

      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="border border-gray-800 bg-black/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 h-full relative z-10 overflow-hidden">
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

        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-white font-bold truncate">{song.fileName}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-black/30 backdrop-blur-md shadow-md group-hover:shadow-lg transition-all duration-300">
            <img
             src={imageUrl}
              alt={song.fileName}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

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
                  "rounded-full w-16 h-16 transition-all duration-300",
                  isPlaying
                    ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 shadow-xl"
                    : "bg-black/50 backdrop-blur-md text-white hover:scale-105",
                )}
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <PauseCircle className="h-10 w-10 text-white" />
                ) : (
                  <PlayCircle className="h-10 w-10 text-white" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
            <div>{formatFileSize(song.size)}</div>
            <div>{new Date(song.uploadedAt).toLocaleDateString()}</div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white transition-all duration-300"
          >
            <Link to={`/music/${song.id}`} className="flex items-center justify-center gap-2">
              <InfoIcon className="h-4 w-4" /> View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Helper function to format file size
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}

