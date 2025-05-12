"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Edit, Save, Sparkles, X, Music, Loader2, Check, Mic, Clock, FileText, Headphones } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { transcribeMusicFile } from "@/store/slices/musicFilesSlice"

interface SongLyricsProps {
  songId: number
  currentTime?: number
  isPlaying?: boolean
  duration?: number
}

interface TimedLyric {
  text: string
  startTime: number
  endTime: number
  isHeader?: boolean
}

export default function SongLyrics({ songId, currentTime = 0, isPlaying = false, duration = 0 }: SongLyricsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLyrics, setEditedLyrics] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<"transcript" | "translation">("transcript")
  const [isKaraokeMode, setIsKaraokeMode] = useState(false)
  const [timedLyrics, setTimedLyrics] = useState<TimedLyric[]>([])
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  // Get transcript and loading state from Redux store
  const { lyricsLoading, files } = useSelector((state: RootState) => state.musicFiles)
  const currentSong = files.find((file) => file.id === songId)
  const transcriptFromFile = currentSong?.transcript

  const hasTranscriptionData = Boolean(transcriptFromFile)
console.log(isPlaying);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Update editedLyrics when transcript changes
  useEffect(() => {
    if (transcriptFromFile) {
      setEditedLyrics(transcriptFromFile)
      parseTimedLyrics(transcriptFromFile)
    }
  }, [transcriptFromFile])

  // Re-parse lyrics when duration changes
  useEffect(() => {
    if (duration > 0 && transcriptFromFile && isKaraokeMode) {
      parseTimedLyrics(transcriptFromFile)
    }
  }, [duration, transcriptFromFile, isKaraokeMode])

  // Update active lyric based on current playback time
  useEffect(() => {
    if (isKaraokeMode && timedLyrics.length > 0) {
      // Find the lyric that corresponds to the current time
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
  }, [currentTime, isKaraokeMode, timedLyrics, activeLyricIndex])

  // Parse transcript into timed format with better handling for musical interludes
  const parseTimedLyrics = (rawLyrics: string) => {
    if (!rawLyrics) return

    const lines = rawLyrics.split("\n")
    // Use actual duration if available, otherwise default to 4 minutes
    const totalDuration = duration > 0 ? duration : 240

    // Identify potential headers and sections
    const sections: { start: number; end: number; isHeader: boolean }[] = []
    let currentSectionStart = 0

    // First pass: identify sections and headers
    lines.forEach((line, index) => {
      const isHeader = line.includes("[") && line.includes("]")

      // If we find a header, mark the end of the previous section
      if (isHeader && index > 0) {
        sections.push({
          start: currentSectionStart,
          end: index - 1,
          isHeader: false,
        })
        currentSectionStart = index
      }
    })

    // Add the final section
    sections.push({
      start: currentSectionStart,
      end: lines.length - 1,
      isHeader: false,
    })

    // Calculate time distribution based on sections
    const nonEmptyLines = lines.filter((line) => line.trim() !== "").length

    // Adjust timing to account for instrumental sections
    // Reserve 20% of the duration for potential instrumental breaks
    const reservedTime = totalDuration * 0.2
    const timePerLine = (totalDuration - reservedTime) / (nonEmptyLines || 1)

    // Distribute the reserved time among sections proportionally
    const sectionCount = sections.length
    const timePerSection = reservedTime / (sectionCount || 1)

    const parsedLyrics: TimedLyric[] = []
    let currentTime = 0

    lines.forEach((line, _) => {
      if (line.trim() === "") {
        // Empty line, just add it with minimal duration
        parsedLyrics.push({
          text: line,
          startTime: currentTime,
          endTime: currentTime + 0.1,
          isHeader: false,
        })
        return
      }

      const isHeader = line.includes("[") && line.includes("]")

      // Headers get a shorter duration, sections with fewer lines get more time per line
      let lineDuration = timePerLine

      if (isHeader) {
        // Add a small pause before headers to account for section changes
        currentTime += timePerSection / 2
        lineDuration = timePerLine * 0.5
      }

      parsedLyrics.push({
        text: line,
        startTime: currentTime,
        endTime: currentTime + lineDuration,
        isHeader,
      })

      currentTime += lineDuration
    })

    // Ensure the last line extends to the end of the song
    if (parsedLyrics.length > 0) {
      const lastLyric = parsedLyrics[parsedLyrics.length - 1]
      if (lastLyric.endTime < totalDuration) {
        lastLyric.endTime = totalDuration
      }
    }

    setTimedLyrics(parsedLyrics)
    setActiveLyricIndex(-1)
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
      await dispatch(transcribeMusicFile(songId))
      toast.success("Lyrics transcribed successfully!")
    } catch (error) {
      console.error("Error transcribing lyrics:", error)
      toast.error("Failed to transcribe lyrics")
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
      // In a real implementation, you would dispatch an action to save the edited transcript
      // For now, we'll just update the local state
      // dispatch(updateLyrics({ songId, transcript: editedLyrics }))
      setIsEditing(false)
      toast.success("Lyrics saved successfully!")

      // Re-parse the timed transcript after editing
      parseTimedLyrics(editedLyrics)
    } catch (error) {
      console.error("Error saving lyrics:", error)
      toast.error("Failed to save lyrics")
    }
  }

  const handleCancelEdit = () => {
    setEditedLyrics(transcriptFromFile || "")
    setIsEditing(false)
  }

  const toggleKaraokeMode = () => {
    setIsKaraokeMode(!isKaraokeMode)
    if (!isKaraokeMode) {
      // Re-parse lyrics when enabling karaoke mode to ensure timing is up to date
      if (transcriptFromFile) {
        parseTimedLyrics(transcriptFromFile)
      }
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
                ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 text-white scale-105 font-medium"
                : ""
            }`}
            style={{
              opacity: isKaraokeMode ? (index === activeLyricIndex ? 1 : index < activeLyricIndex ? 0.5 : 0.7) : 1,
            }}
          >
            {lyric.text}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Music className="h-5 w-5 text-red-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">Lyrics</span>
          {hasTranscriptionData && (
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 backdrop-blur-sm flex items-center gap-1">
              <FileText className="h-3 w-3" />
              AI Transcribed
            </Badge>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {transcriptFromFile && !isEditing && (
            <>
              <div className="flex items-center gap-2 mr-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="karaoke-mode"
                    checked={isKaraokeMode}
                    onCheckedChange={toggleKaraokeMode}
                    className="data-[state=checked]:bg-gradient-to-r from-red-500 to-blue-500"
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
        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg p-6 h-64 flex items-center justify-center border border-gray-800">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-red-400 animate-spin" />
            <p className="text-gray-400">Loading lyrics...</p>
          </div>
        </div>
      ) : isGenerating ? (
        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg p-6 h-64 flex flex-col items-center justify-center border border-gray-800">
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <Sparkles className="h-8 w-8 text-red-400" />
            <p className="text-white font-medium">Transcribing lyrics with AI...</p>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm text-center">
              Our AI is analyzing the audio and transcribing the lyrics
            </p>
          </div>
        </div>
      ) : transcriptFromFile ? (
        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 overflow-hidden">
          <Tabs
            defaultValue="transcript"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "transcript" | "translation")}
          >
            <div className="border-b border-gray-800">
              <TabsList className="bg-gray-900/50 w-full justify-start rounded-none border-b border-gray-800">
                <TabsTrigger
                  value="transcript"
                  className="data-[state=active]:bg-gray-900/30 data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none"
                >
                  Lyrics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="transcript" className="m-0 p-0">
              {isEditing ? (
                <div className="p-4">
                  <Textarea
                    value={editedLyrics}
                    onChange={(e) => setEditedLyrics(e.target.value)}
                    className="min-h-[240px] bg-gray-900/30 border-gray-700 text-white resize-none"
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
                      className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
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
                    <div className="p-6 whitespace-pre-line leading-relaxed">{transcriptFromFile}</div>
                  )}
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="bg-gray-900/30 backdrop-blur-md rounded-lg p-6 border border-gray-800">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-gradient-to-br from-red-500/20 to-blue-500/20 p-3 rounded-full mb-4">
              <Headphones className="h-8 w-8 text-red-400" />
            </div>
            <h4 className="text-white font-medium mb-2">No lyrics available for this track</h4>
            <p className="text-gray-400 mb-6 max-w-md">
              We couldn't find lyrics for this song. Would you like our AI to transcribe the song lyrics?
            </p>
            <Button
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
              onClick={generateLyrics}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Transcribe Lyrics with AI
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {transcriptFromFile && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between text-xs text-gray-500 px-2"
          >
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>
                {isEditing ? "Lyrics being edited" : hasTranscriptionData ? "AI transcribed lyrics" : "Lyrics verified"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isKaraokeMode && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(currentTime * 1000).toISOString().substr(14, 5)}
                </span>
              )}
              <span>
                {transcriptFromFile
                  ? `${transcriptFromFile.split("\n").length} lines • ${transcriptFromFile.length} characters`
                  : ""}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
