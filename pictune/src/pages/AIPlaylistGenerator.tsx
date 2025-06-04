"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Sparkles,
  Loader2,
  Music,
  Wand2,
  Lightbulb,
  ArrowRight,
  Check,
  RefreshCw,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { generatePlaylistByPrompt, PlaylistType } from "@/store/slices/playlistsSlice"
import Background from "../components/Background"
import { AppDispatch } from "@/store/store"
import { useDispatch } from "react-redux"



export default function AIPlaylistGenerator() {
  const dispatch = useDispatch<AppDispatch>()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedPlaylist, setGeneratedPlaylist] = useState<PlaylistType | null>(null)
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate()

  const examplePrompts = [
    "Upbeat songs for a morning workout",
    "Relaxing jazz for a rainy evening",
    "90s rock classics that defined a generation",
    "Songs that blend electronic and acoustic elements",
    "Music for deep focus and concentration",
  ]

  const moodSuggestions = [
    "Energetic",
    "Relaxing",
    "Nostalgic",
    "Romantic",
    "Melancholic",
    "Uplifting",
    "Focused",
    "Dreamy",
    "Intense",
    "Peaceful",
  ]

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
    if (promptInputRef.current) {
      promptInputRef.current.focus()
    }
  }

  const handleMoodClick = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood))
    } else {
      setSelectedMoods([...selectedMoods, mood])

      // Also update the prompt if it's not empty
      if (prompt) {
        setPrompt((prev) => `${prev}${prev.endsWith(".") || prev.endsWith(",") ? " " : ", "}${mood.toLowerCase()}`)
      } else {
        setPrompt(mood)
      }
    }
  }

  const simulateProgress = () => {
    // Simulate progress for demo purposes
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

  const handleGeneratePlaylist = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate a playlist")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setGeneratedPlaylist(null)
    simulateProgress()

    try {
       const response = await dispatch(generatePlaylistByPrompt({ prompt })).unwrap();
      setGeneratedPlaylist(response)
      setGenerationProgress(100)
      toast.success("Playlist generated successfully!")
    } catch (error) {
      console.error("Error generating playlist:", error)
      toast.error("Failed to generate playlist. Please try again.")
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setIsGenerating(false)
    }
  }

  const viewGeneratedPlaylist = () => {
    if (generatedPlaylist) {
      // In a real app, navigate to the newly created playlist
      toast.info("Navigating to your new playlist")
      navigate(`/playlists/${generatedPlaylist.id}`)
    }
  }

  const resetGenerator = () => {
    setPrompt("")
    setSelectedMoods([])
    setGeneratedPlaylist(null)
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 pb-20 bg-gradient-to-br from-black via-black/90 to-black/80">
      {/* Background Image */}
      <Background/>
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">AI Playlist Generator</h1>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Describe the vibe, mood, or theme you're looking for, and our AI will create a personalized playlist just
              for you.
            </p>
          </div>

          <Card className="border-gray-800 bg-black/40 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-blue-500"></div>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-blue-400" />
                Create Your AI Playlist
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-white font-medium">
                  Describe your perfect playlist
                </label>
                <Textarea
                  ref={promptInputRef}
                  id="prompt"
                  placeholder="e.g., 'Upbeat songs for a morning workout' or 'Relaxing jazz for a rainy evening'"
                  value={prompt}
                  onChange={handlePromptChange}
                  className="min-h-[120px] bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                  disabled={isGenerating}
                />
                <p className="text-gray-400 text-sm">
                  Be specific about genres, moods, activities, or eras to get better results.
                </p>
              </div>

              {!generatedPlaylist && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-400" />
                      <h3 className="text-white font-medium">Example prompts</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {examplePrompts.map((example, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleExampleClick(example)}
                          className="text-sm text-left text-gray-300 bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-md transition-colors border border-gray-800"
                          disabled={isGenerating}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {example}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-blue-400" />
                      <h3 className="text-white font-medium">Add moods</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {moodSuggestions.map((mood, index) => (
                        <Badge
                          key={index}
                          variant={selectedMoods.includes(mood) ? "default" : "outline"}
                          className={`cursor-pointer transition-all duration-300 ${
                            selectedMoods.includes(mood)
                              ? "bg-gradient-to-r from-red-600 to-blue-600 text-white border-0"
                              : "bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white border-gray-700"
                          }`}
                          onClick={() => handleMoodClick(mood)}
                        >
                          {selectedMoods.includes(mood) && <Check className="h-3 w-3 mr-1" />}
                          {mood}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {isGenerating && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                    <p className="text-white font-medium">Generating your playlist...</p>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-300 ease-out"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-gray-400 text-sm">
                    Our AI is curating the perfect tracks based on your prompt
                  </p>
                </div>
              )}

              {generatedPlaylist && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 bg-black/50 p-4 rounded-lg border border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">{generatedPlaylist.name}</h3>
                    <Badge className="bg-gradient-to-r from-red-600 to-blue-600 text-white border-0">
                      AI Generated
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">{generatedPlaylist.description}</p>

                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Songs ({generatedPlaylist.songs.length})</h4>
                    <ul className="space-y-2">
                      {generatedPlaylist.songs.map((song, index) => (
                        <motion.li
                          key={song.id}
                          className="flex items-center justify-between bg-black/50 p-3 rounded-md border border-gray-800"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 flex items-center justify-center">
                              <Music className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white">{song.displayName}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <Play className="h-4 w-4" />
                          </Button>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3">
              {!generatedPlaylist ? (
                <Button
                  onClick={handleGeneratePlaylist}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Playlist
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={viewGeneratedPlaylist}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
                  >
                    <Music className="mr-2 h-4 w-4" />
                    View Playlist
                  </Button>
                  <Button
                    onClick={resetGenerator}
                    variant="outline"
                    className="w-full sm:w-auto border-gray-700 text-white hover:bg-white/10"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Create Another
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>

          <div className="mt-8 bg-black/40 backdrop-blur-md border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-white font-medium">Describe Your Vibe</h3>
                  <p className="text-gray-400">
                    Enter a prompt describing the mood, genre, or theme you want for your playlist.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-white font-medium">AI Generation</h3>
                  <p className="text-gray-400">
                    Our AI analyzes your prompt and curates a personalized playlist of songs that match your
                    description.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-white font-medium">Enjoy Your Playlist</h3>
                  <p className="text-gray-400">
                    Save the generated playlist to your library and start listening to your personalized music
                    selection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate("/playlists")} className="text-gray-400 hover:text-white">
              Back to My Playlists
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
