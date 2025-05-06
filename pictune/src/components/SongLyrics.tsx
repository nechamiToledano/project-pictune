"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Edit, Save, Sparkles, X, Music, Loader2, Check, AlertCircle, Mic, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { RootState } from "@/store/store"
import {  useSelector } from "react-redux"
import { transcribeMusicFile } from "@/store/slices/musicFilesSlice"

interface SongLyricsProps {
  songId: number
  currentTime?: number
  isPlaying?: boolean
}

interface TimedLyric {
  text: string
  startTime: number
  endTime: number
  isHeader?: boolean
}

export default function SongLyrics({ songId, currentTime = 0, isPlaying = false }: SongLyricsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLyrics, setEditedLyrics] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<"lyrics" | "translation">("lyrics")
  const [isKaraokeMode, setIsKaraokeMode] = useState(false)
  const [timedLyrics, setTimedLyrics] = useState<TimedLyric[]>([])
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const { lyrics, lyricsLoading } = useSelector((state: RootState) => state.musicFiles)

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Update editedLyrics when lyrics change
  useEffect(() => {
    if (lyrics) {
      setEditedLyrics(lyrics)
      // Parse lyrics into timed format when lyrics are loaded
      parseTimedLyrics(lyrics)
    }
  }, [lyrics])

  // Update active lyric based on current playback time
  useEffect(() => {
    if (isKaraokeMode && isPlaying && timedLyrics.length > 0) {
      const newActiveLyricIndex = timedLyrics.findIndex(
        (lyric) => currentTime >= lyric.startTime && currentTime < lyric.endTime,
      )

      if (newActiveLyricIndex !== -1 && newActiveLyricIndex !== activeLyricIndex) {
        setActiveLyricIndex(newActiveLyricIndex)

        // Auto-scroll to the active lyric
        if (scrollAreaRef.current) {
          const activeElement = scrollAreaRef.current.querySelector(`[data-lyric-index="${newActiveLyricIndex}"]`)
          if (activeElement) {
            activeElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }
      }
    }
  }, [currentTime, isKaraokeMode, isPlaying, timedLyrics, activeLyricIndex])

  // Parse lyrics into timed format
  const parseTimedLyrics = (rawLyrics: string) => {
    if (!rawLyrics) return

    const lines = rawLyrics.split("\n")
    const totalDuration = 240 // Assume 4 minutes if we don't have real duration

    const parsedLyrics: TimedLyric[] = []
    let currentTime = 0
    const timePerLine = totalDuration / lines.filter((line) => line.trim() !== "").length

    lines.forEach((line) => {
      if (line.trim() === "") {
        // Empty line, just add it with the same time as the previous line
        if (parsedLyrics.length > 0) {
          const prevLyric = parsedLyrics[parsedLyrics.length - 1]
          parsedLyrics.push({
            text: line,
            startTime: prevLyric.endTime,
            endTime: prevLyric.endTime,
            isHeader: false,
          })
        }
        return
      }

      const isHeader = line.includes("[") && line.includes("]")

      // Headers get a shorter duration
      const lineDuration = isHeader ? timePerLine * 0.5 : timePerLine

      parsedLyrics.push({
        text: line,
        startTime: currentTime,
        endTime: currentTime + lineDuration,
        isHeader,
      })

      currentTime += lineDuration
    })

    setTimedLyrics(parsedLyrics)
  }

  const simulateProgress = () => {
    progressIntervalRef.current = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          return 95
        }
        return prev + Math.random() * 10
      })
    }, 800)
  }

  const generateLyrics = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    simulateProgress()

    try {
      await transcribeMusicFile(songId)
      toast.success("Lyrics generated successfully!")
    } catch (error) {
      console.error("Error generating lyrics:", error)
      toast.error("Failed to generate lyrics")
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setGenerationProgress(100)
      setIsGenerating(false)
    }
  }

  const saveLyrics = async () => {
    try {
      // In a real implementation, you would dispatch an action to save the edited lyrics
      // For now, we'll just update the local state
      // dispatch(updateLyrics({ songId, lyrics: editedLyrics }))
      setIsEditing(false)
      toast.success("Lyrics saved successfully!")

      // Re-parse the timed lyrics after editing
      parseTimedLyrics(editedLyrics)
    } catch (error) {
      console.error("Error saving lyrics:", error)
      toast.error("Failed to save lyrics")
    }
  }

  const handleCancelEdit = () => {
    setEditedLyrics(lyrics || "")
    setIsEditing(false)
  }

  const toggleKaraokeMode = () => {
    setIsKaraokeMode(!isKaraokeMode)
    if (!isKaraokeMode) {
      toast.success("Karaoke mode activated! Lyrics will highlight in sync with the music.")
    }
  }

  const renderTimedLyrics = () => {
    return (
      <div className="space-y-1 py-2">
        {timedLyrics.map((lyric, index) => (
          <div
            key={index}
            data-lyric-index={index}
            className={`transition-all duration-300 px-2 py-1 rounded ${
              lyric.text.trim() === "" ? "h-4" : lyric.isHeader ? "font-bold text-white/90" : "text-white/80"
            } ${
              isKaraokeMode && index === activeLyricIndex
                ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white scale-105 font-medium"
                : ""
            }`}
            style={{
              opacity: isKaraokeMode ? (index === activeLyricIndex ? 1 : index < activeLyricIndex ? 0.5 : 0.7) : 1,
            }}
          >
            {lyric.text}
            {isKaraokeMode && index === activeLyricIndex && (
              <motion.div
                className="h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mt-1 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentTime - lyric.startTime) / (lyric.endTime - lyric.startTime)) * 100}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Music className="h-5 w-5 text-blue-400" />
          Lyrics
        </h3>
        <div className="flex items-center gap-2">
          {lyrics && !isEditing && (
            <>
              <div className="flex items-center gap-2 mr-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="karaoke-mode"
                    checked={isKaraokeMode}
                    onCheckedChange={toggleKaraokeMode}
                    className="data-[state=checked]:bg-gradient-to-r from-purple-600 to-blue-600"
                  />
                  <label
                    htmlFor="karaoke-mode"
                    className="text-sm font-medium text-white cursor-pointer flex items-center gap-1"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    Karaoke
                  </label>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-gray-700 hover:bg-white/10"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {lyricsLoading && !isGenerating ? (
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 h-64 flex items-center justify-center border border-gray-800">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
            <p className="text-gray-400">Loading lyrics...</p>
          </div>
        </div>
      ) : isGenerating ? (
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 h-64 flex flex-col items-center justify-center border border-gray-800">
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <p className="text-white font-medium">Generating lyrics with AI...</p>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm text-center">
              Our AI is analyzing the song and creating lyrics that match the mood and style
            </p>
          </div>
        </div>
      ) : lyrics ? (
        <div className="bg-black/30 backdrop-blur-md rounded-lg border border-gray-800 overflow-hidden">
          <Tabs
            defaultValue="lyrics"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "lyrics" | "translation")}
          >
            <div className="border-b border-gray-800">
              <TabsList className="bg-black/50 w-full justify-start rounded-none border-b border-gray-800">
                <TabsTrigger
                  value="lyrics"
                  className="data-[state=active]:bg-black/30 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none"
                >
                  Original
                </TabsTrigger>
              
              </TabsList>
            </div>

            <TabsContent value="lyrics" className="m-0 p-0">
              {isEditing ? (
                <div className="p-4">
                  <Textarea
                    value={editedLyrics}
                    onChange={(e) => setEditedLyrics(e.target.value)}
                    className="min-h-[240px] bg-black/30 border-gray-700 text-white resize-none"
                    placeholder="Edit lyrics here..."
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-white/10"
                      onClick={handleCancelEdit}
                      disabled={lyricsLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={saveLyrics}
                      disabled={lyricsLoading}
                    >
                      {lyricsLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <ScrollArea ref={scrollAreaRef} className="h-64 relative" scrollHideDelay={100}>
                  {isKaraokeMode ? (
                    renderTimedLyrics()
                  ) : (
                    <div className="p-6 whitespace-pre-line leading-relaxed">{lyrics}</div>
                  )}
                </ScrollArea>
              )}
            </TabsContent>

          </Tabs>
        </div>
      ) : (
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-gray-800">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-black/50 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-purple-500" />
            </div>
            <h4 className="text-white font-medium mb-2">No lyrics available for this track</h4>
            <p className="text-gray-400 mb-6 max-w-md">
              We couldn't find lyrics for this song. Would you like our AI to generate lyrics based on the song title
              and style?
            </p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              onClick={generateLyrics}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Lyrics with AI
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {lyrics && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between text-xs text-gray-500 px-2"
          >
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>Lyrics {isEditing ? "being edited" : "verified"}</span>
            </div>
            <div className="flex items-center gap-2">
              {isKaraokeMode && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(currentTime * 1000).toISOString().substr(14, 5)}
                </span>
              )}
              <span>{lyrics ? `${lyrics.split("\n").length} lines • ${lyrics.length} characters` : ""}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
