"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlaylists, selectPlaylists, setCurrentPlaylist } from "@/store/slices/playlistsSlice"
import { useNavigate } from "react-router-dom"
import type { PlaylistType } from "@/store/slices/playlistsSlice"
import type { AppDispatch } from "@/store/store"
import { motion } from "framer-motion"
import { Music, Plus, ListMusic, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Background from "@/components/Background"

const MusicLibrary: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const playlists = useSelector(selectPlaylists)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlaylists = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await dispatch(fetchPlaylists())
      } catch (err) {
        setError("Failed to load playlists. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPlaylists()
  }, [dispatch])

  const handlePlaylistClick = (playlist: PlaylistType) => {
    dispatch(setCurrentPlaylist(playlist.id))
    navigate(`/playlists/${playlist.id}`)
  }

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-xl text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-red-500 animate-spin"></div>
              <div className="absolute inset-1 rounded-full border-r-2 border-l-2 border-blue-500 animate-spin animation-delay-150"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ListMusic className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Loading Playlists</h3>
              <p className="text-gray-400">Fetching your music collections...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl max-w-md text-center border border-gray-800 shadow-xl">
          <div className="text-red-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Playlists</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => dispatch(fetchPlaylists())}
            className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
          >
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 pb-20">
      <Background />

      <div className="container mx-auto px-4 z-10 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 p-3 rounded-full shadow-lg">
                <ListMusic className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">My Playlists</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search playlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-black/30 border-gray-700 text-white w-full"
                />
              </div>
              <Button
                onClick={() => navigate("/create-playlist")}
                className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </div>
          </div>

          {filteredPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlaylists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handlePlaylistClick(playlist)}
                  className="cursor-pointer h-full"
                >
                  <Card className="overflow-hidden border border-gray-800 shadow-xl transition-all duration-300 hover:shadow-2xl bg-black/30 backdrop-blur-md hover:bg-black/40 h-full flex flex-col">
                    <div className="h-1 w-full bg-gradient-to-r from-red-500 to-blue-500"></div>
                    <CardContent className="p-6 flex-grow">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-md bg-gradient-to-r from-red-600/20 to-blue-600/20">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-grow">
                          <h2 className="text-xl font-bold text-white mb-2">{playlist.name}</h2>
                          {playlist.description && (
                            <p className="text-gray-400 line-clamp-2 mb-3 text-sm">{playlist.description}</p>
                          )}
                          <div className="mt-auto pt-2 flex items-center text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Music className="h-3.5 w-3.5" />
                              {playlist.songs?.length || 0} {playlist.songs?.length === 1 ? "song" : "songs"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl max-w-md border border-gray-800 shadow-xl">
                {searchQuery ? (
                  <>
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No Matching Playlists</h2>
                    <p className="text-gray-400 mb-6">No playlists match your search criteria.</p>
                    <Button
                      onClick={() => setSearchQuery("")}
                      className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                    >
                      Clear Search
                    </Button>
                  </>
                ) : (
                  <>
                    <ListMusic className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No Playlists Yet</h2>
                    <p className="text-gray-400 mb-6">Create your first playlist to organize your music.</p>
                    <Button
                      onClick={() => navigate("/create-playlist")}
                      className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Playlist
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default MusicLibrary
