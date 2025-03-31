"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { createPlaylist } from "@/store/slices/playlistsSlice"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ListMusic, Save, ArrowLeft, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { AppDispatch } from "@/store/store"
import Background from "@/pages/Background"

const CreatePlaylistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter a playlist name")
      return
    }

    setIsSubmitting(true)

    try {
      await dispatch(createPlaylist({ name, description }))
      toast.success("Playlist created successfully!")
      navigate("/playlists")
    } catch (error) {
      console.error("Error creating playlist:", error)
      toast.error("Failed to create playlist. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 pb-20 bg-gradient-to-br from-black via-black/90 to-black/80">
 
   

  <Background />

      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/playlists")}
            className="mb-6 text-white hover:text-white hover:bg-white/20 self-start"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Playlists
          </Button>

          <Card className="border-gray-800 bg-black/40 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-blue-500"></div>

            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20">
                  <ListMusic className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Create New Playlist</CardTitle>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="playlist-name" className="text-white">
                    Playlist Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="playlist-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter playlist name"
                    className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="playlist-description" className="text-white">
                    Description <span className="text-gray-500">(optional)</span>
                  </Label>
                  <Textarea
                    id="playlist-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description for your playlist"
                    className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 min-h-[120px]"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Music className="h-4 w-4" />
                    <span>You can add songs to your playlist after creation</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 pb-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Create Playlist
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default CreatePlaylistPage

