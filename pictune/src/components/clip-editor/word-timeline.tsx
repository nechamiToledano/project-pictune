"use client"

import { motion } from "framer-motion"
import { Music, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { fetchMusicFileUrl, MusicFile } from "@/store/slices/musicFilesSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/store/store"
import { RootState } from "@/store/store"
import { setWords, addWord, updateWordText, updateWordTime, removeWord } from "@/store/slices/wordsSlice"

export default function WordTimeline({ selectedSong }: { selectedSong: MusicFile | null }) {
  const dispatch = useDispatch<AppDispatch>()
  const words = useSelector((state: RootState) => state.words.words)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTranscribe = async () => {
    try {
      setLoading(true)
      if (!selectedSong?.id) return

      const url = await dispatch(fetchMusicFileUrl(selectedSong.id)).unwrap()
      const res = await axios.post("http://127.0.0.1:8000/transcribe_song", {
        url: url,
      })

      dispatch(setWords(res.data.words))
    } catch (error) {
      console.error("שגיאה בשליחת בקשת תמלול:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading words...</div>

  return (
    <div className="p-4 border-t border-gray-800/50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Music className="h-4 w-4" /> Words
        </h3>
        {selectedSong && words.length === 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTranscribe}
            className="text-xs text-white/70 hover:text-white hover:bg-white/10"
          >
            Transcribe song
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(addWord())}
          className="text-xs text-white/70 hover:text-white hover:bg-white/10"
        >
          <Plus className="h-3 w-3 ml-1" /> Add Word
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {words.map((w:any, i:any) => (
          <motion.div
            key={i}
            className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm rounded-md px-2 py-1 text-sm relative group border border-gray-700/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            onClick={() => setEditingIndex(i === editingIndex ? null : i)}
          >
            <input
              value={w.text}
              onChange={(e) => dispatch(updateWordText({ index: i, text: e.target.value }))}
              className="bg-transparent border-none outline-none w-full text-center"
              title={`Word: ${w.text}`}
            />
            <div className="text-xs text-gray-400 text-center">
              {w.start.toFixed(1)}s - {w.end.toFixed(1)}s
            </div>

            {editingIndex === i && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-gray-800 rounded-md border border-gray-700 z-10 shadow-xl">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Start (seconds)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={w.start}
                      onChange={(e) => dispatch(updateWordTime({ index: i, field: "start", value: parseFloat(e.target.value) }))}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">End (seconds)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={w.end}
                      onChange={(e) => dispatch(updateWordTime({ index: i, field: "end", value: parseFloat(e.target.value) }))}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch(removeWord(i))
                    setEditingIndex(null)
                  }}
                >
                  <X className="h-3 w-3 ml-1" /> Remove Word
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500/20 hover:bg-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                dispatch(removeWord(i))
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}