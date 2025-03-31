"use client"

import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlaylists, selectPlaylists, setCurrentPlaylist } from "@/store/slices/playlistsSlice"
import {  useNavigate } from "react-router-dom"
import type { PlaylistType } from "@/store/slices/playlistsSlice"
import type { AppDispatch } from "@/store/store"
import { motion } from "framer-motion"
import { Music, Plus, ListMusic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Background from "./Background"

const MusicLibrary: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const playlists = useSelector(selectPlaylists)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchPlaylists())
  }, [dispatch])

  const handlePlaylistClick = (playlist: PlaylistType) => {
    dispatch(setCurrentPlaylist(playlist.id))
    navigate(`/playlists/${playlist.id}`)
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 pb-20 bg-gradient-to-br from-black via-black/90 to-black/80">
     <Background/>

      <div className="container mx-auto px-4 z-10 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-red-600 to-blue-600 p-3 rounded-full shadow-lg">
                <ListMusic className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">My Playlists</h1>
            </div>

            <Button onClick={()=>navigate("/create-playlist")} className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handlePlaylistClick(playlist)}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden border-gray-800 shadow-xl transition-all duration-300 hover:shadow-2xl bg-black/40 backdrop-blur-md hover:bg-black/50">
                    <div className="h-1 w-full bg-gradient-to-r from-red-500 to-blue-500"></div>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-md bg-gradient-to-r from-red-700 to-blue-700">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white mb-2">{playlist.name}</h2>
                          {playlist.description && <p className="text-gray-400 line-clamp-2">{playlist.description}</p>}
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <span>{playlist.songs?.length || 0} songs</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl max-w-md border border-gray-800">
                  <ListMusic className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">No Playlists Yet</h2>
                  <p className="text-gray-400 mb-6">Create your first playlist to organize your music.</p>
                  <Button className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Playlist
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MusicLibrary

