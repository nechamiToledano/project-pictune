import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { fetchSongLyrics } from "@/store/slices/musicFilesSlice"
import type { AppDispatch, RootState } from "@/store/store"

interface LyricsSectionProps {
  songId: number
}

export default function LyricsSection({ songId }: LyricsSectionProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { lyrics, lyricsLoading, lyricsError } = useSelector((state: RootState) => state.musicFiles)

  useEffect(() => {
    if (songId) {
      dispatch(fetchSongLyrics(songId))
    }
  }, [dispatch, songId])

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 whitespace-pre-line leading-relaxed h-64 overflow-y-auto border border-gray-800 mt-6">
      <h3 className="text-xl font-semibold mb-3">Lyrics</h3>
      {lyricsLoading ? (
        <div className="flex items-center justify-center gap-3 text-white/80">
          <Loader2 className="h-6 w-6 animate-spin" />
          Fetching lyrics...
        </div>
      ) : lyricsError ? (
        <p className="text-center text-red-500">{lyricsError}</p>
      ) : lyrics ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-white/90"
        >
          {lyrics}
        </motion.p>
      ) : (
        <p className="text-center text-white/50 italic">No lyrics available for this track.</p>
      )}
    </div>
  )
}
