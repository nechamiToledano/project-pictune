"use client"

import { useEffect, useState } from "react"
import { Search, Music, Disc3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { fetchMusicFiles, MusicFile } from "@/store/slices/musicFilesSlice"

interface SongSelectorProps {
  onSelectSong: (song: MusicFile) => void
  selectedSong: MusicFile | null
}

export default function SongSelector({ onSelectSong, selectedSong }: SongSelectorProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { files, loading } = useSelector((state: RootState) => state.musicFiles)
  const dispatch = useDispatch<AppDispatch>()

  const filteredSongs = files.filter(
    (song) =>
      song.fileName.toLowerCase().includes(searchTerm.toLowerCase()) 
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }
   useEffect(() => {
     dispatch(fetchMusicFiles({}))
   }, [dispatch,])
 
  
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-medium">Select a song from the library</h3>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search a song by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800/50 border-gray-700/50"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
        {loading ? (
          <div className="flex justify-center py-8">
            <Disc3 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={`p-3 cursor-pointer hover:bg-gray-800/70 transition-colors ${
                  selectedSong?.id === song.id
                    ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 border-gray-700"
                    : "bg-gray-800/30 border-gray-800/50"
                }`}
                onClick={() => onSelectSong(song)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{song.fileName}</h4>
                    <div className="flex items-center text-xs text-gray-400 gap-2">
                     
                      <span>{formatFileSize(song.size)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-600/30 hover:to-blue-600/30 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectSong(song)
                    }}
                  >
                    Select
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Music className="h-10 w-10 mx-auto mb-2 text-gray-500" />
            <p>No songs found</p>
          </div>
        )}
      </div>
    </div>
  )
}
