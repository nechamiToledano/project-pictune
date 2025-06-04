"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchPlaylists,
  selectPlaylistWithSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
  fetchPlaylistById,
  updatePlaylist,
} from "@/store/slices/playlistsSlice"
import { useParams, useNavigate } from "react-router-dom"
import { fetchMusicFileUrl, type MusicFile } from "@/store/slices/musicFilesSlice"
import api from "@/components/Api"
import type { AppDispatch, RootState } from "@/store/store"
import { motion } from "framer-motion"
import {
  Music,
  Plus,
  Trash2,
  ArrowLeft,
  ListMusic,
  Edit,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  Loader2,
  Save,
  X,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Background from "@/components/Background"

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const playlist = useSelector((state: RootState) => selectPlaylistWithSongs(state, id || ""))
  const [availableSongs, setAvailableSongs] = useState<MusicFile[]>([])
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null)
  const [_, setCurrentSongIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentSongUrl, setCurrentSongUrl] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [playlistName, setPlaylistName] = useState("")
  const [playlistDescription, setPlaylistDescription] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (playlist) {
      setPlaylistName(playlist.name || "")
      setPlaylistDescription(playlist.description || "")
    }
  }, [playlist])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      if (!playlist) {
        await dispatch(fetchPlaylists())
      }

      try {
        const response = await api.get("/files")
        setAvailableSongs(response.data)
      } catch (error) {
        console.error("Failed to fetch songs:", error)
        toast.error("Failed to load songs")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [dispatch, playlist])

  const handlePlayAll = async () => {
    if (playlist && playlist.songs && playlist.songs.length > 0) {
      try {
        toast.info("Loading playlist songs...", { duration: 2000 })
        const songUrls = await Promise.all(
          playlist.songs.map(async (song) => {
            const result = await dispatch(fetchMusicFileUrl(song.id) as any)
            return result.payload
          }),
        )
        const validUrls = songUrls.filter(Boolean)
        if (validUrls.length > 0) {
          playSongs(validUrls)
          toast.success(`Playing ${validUrls.length} songs`)
        } else {
          toast.error("No playable songs found in this playlist")
        }
      } catch (error) {
        console.error("Error playing songs:", error)
        toast.error("Failed to play songs")
      }
    } else {
      toast.error("This playlist has no songs to play")
    }
  }

  const playSongs = (urls: string[], startIndex = 0) => {
    if (urls.length === 0) {
      toast.error("No songs to play")
      return
    }

    if (audioPlayer) {
      audioPlayer.pause()
    }

    const audio = new Audio()
    setAudioPlayer(audio)
    setCurrentSongIndex(startIndex)
    setIsPlaying(true)

    const playNextSong = (index: number) => {
      if (index >= urls.length) {
        toast.success("Playlist finished")
        setIsPlaying(false)
        return
      }

      const url = urls[index]
      audio.src = url
      audio
        .play()
        .then(() => {
          setCurrentSongUrl(url)
          setCurrentSongIndex(index)
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error("Playback error:", error)
          toast.error("Error playing song")
        })

      audio.onended = () => playNextSong(index + 1)
    }

    playNextSong(startIndex)
  }

  const pauseSong = () => {
    if (audioPlayer) {
      audioPlayer.pause()
      setIsPlaying(false)
      toast.info("Playback paused")
    }
  }

  const resumeSong = () => {
    if (audioPlayer && currentSongUrl) {
      audioPlayer
        .play()
        .then(() => {
          setIsPlaying(true)
          toast.info("Playback resumed")
        })
        .catch((error) => {
          console.error("Resume error:", error)
          toast.error("Error resuming playback")
        })
    }
  }

  const stopSong = () => {
    if (audioPlayer) {
      audioPlayer.pause()
      audioPlayer.currentTime = 0
      setIsPlaying(false)
      setCurrentSongUrl(null)
      toast.info("Playback stopped")
    }
  }

  const handleAddSong = async () => {
    if (id && selectedSongId) {
      try {
        await dispatch(addSongToPlaylist({ playlistId: id, songId: selectedSongId }))
        await dispatch(fetchPlaylistById(id))
        toast.success("Song added to playlist")
        setSelectedSongId(null)
      } catch (error) {
        console.error("Error adding song:", error)
        toast.error("Failed to add song to playlist")
      }
    } else {
      toast.error("Please select a song to add")
    }
  }

  const handleRemoveSong = async (songId: number) => {
    if (id) {
      try {
        await dispatch(removeSongFromPlaylist({ playlistId: id, songId }))
        toast.success("Song removed from playlist")
      } catch (error) {
        console.error("Error removing song:", error)
        toast.error("Failed to remove song from playlist")
      }
    }
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const handleSave = async () => {
    if (id && playlistName.trim()) {
      setIsUpdating(true)
      try {
        await dispatch(updatePlaylist({ id, name: playlistName, description: playlistDescription }))
        await dispatch(fetchPlaylistById(id))
        toast.success("Playlist updated successfully")
        setEditMode(false)
      } catch (error) {
        console.error("Error updating playlist:", error)
        toast.error("Failed to update playlist")
      } finally {
        setIsUpdating(false)
      }
    } else {
      toast.error("Please provide a valid name for the playlist")
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    if (playlist) {
      setPlaylistName(playlist.name || "")
      setPlaylistDescription(playlist.description || "")
    }
  }

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
              <h3 className="text-xl font-bold text-white">Loading Playlist</h3>
              <p className="text-gray-400">Fetching your playlist details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl max-w-md text-center border border-gray-800 shadow-xl">
          <div className="text-red-400 mb-4">
            <Info className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Playlist Not Found</h2>
          <p className="text-gray-400 mb-6">
            The playlist you're looking for could not be found or may have been deleted.
          </p>
          <Button
            onClick={() => navigate("/playlists")}
            className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
          >
            Back to Playlists
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
          <Button
            variant="ghost"
            onClick={() => navigate("/playlists")}
            className="mb-6 text-white hover:text-white hover:bg-white/10 self-start"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Playlists
          </Button>

          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-square relative rounded-xl overflow-hidden bg-black/30 backdrop-blur-md shadow-2xl mb-6 group border border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ListMusic className="h-24 w-24 text-white/50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  {editMode ? (
                    <Input
                      type="text"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      className="text-xl font-bold text-white bg-black/50 border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Playlist name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
                  )}
                  <p className="text-gray-300 text-sm">{playlist.songs.length} songs</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-6 w-full">
                <Button
                  className="w-full bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                  onClick={handlePlayAll}
                  disabled={!playlist.songs.length}
                >
                  <Play className="h-4 w-4 mr-2" /> Play All
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className={`border-gray-700 ${isPlaying ? "text-white hover:bg-white/10" : "text-gray-500 cursor-not-allowed"}`}
                    onClick={pauseSong}
                    disabled={!isPlaying}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>

                  <Button
                    variant="outline"
                    className={`border-gray-700 ${!isPlaying && currentSongUrl ? "text-white hover:bg-white/10" : "text-gray-500 cursor-not-allowed"}`}
                    onClick={resumeSong}
                    disabled={isPlaying || !currentSongUrl}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>

                  <Button
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                    onClick={stopSong}
                    disabled={!currentSongUrl}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>

                {!editMode ? (
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-white hover:bg-white/10"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit Playlist
                  </Button>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Save
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  </div>
                )}
              </div>

              {editMode ? (
                <div className="mb-6">
                  <label className="text-white text-sm mb-2 block">Description</label>
                  <Textarea
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    className="bg-black/30 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                    placeholder="Add a description for your playlist"
                  />
                </div>
              ) : (
                playlist.description && (
                  <Card className="bg-black/30 backdrop-blur-md border-gray-800 mb-6">
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold mb-2">Description</h3>
                      <p className="text-gray-400">{playlist.description}</p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>

            <div className="w-full md:w-2/3 lg:w-3/4">
              <Card className="bg-black/30 backdrop-blur-md border-gray-800 mb-6">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Add Song to Playlist</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select onValueChange={(value: any) => setSelectedSongId(Number(value))}>
                      <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                        <SelectValue placeholder="Select a song to add" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-gray-700 text-white">
                        {availableSongs.map((song) => (
                          <SelectItem key={song.id} value={song.id.toString()}>
                            {song.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddSong}
                      className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Song
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Songs in Playlist</h2>
                <div className="text-sm text-gray-400">
                  {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                </div>
              </div>

              {playlist.songs.length > 0 ? (
                <div className="space-y-3">
                  {playlist.songs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="bg-black/30 backdrop-blur-md border-gray-800 hover:bg-black/40 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-gradient-to-r from-red-600/20 to-blue-600/20">
                                <Music className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{song.displayName}</p>
                                <p className="text-gray-500 text-sm">{formatFileSize(song.size || 0)}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-black/90 border-gray-700 text-white">
                                <DropdownMenuItem
                                  className="text-red-400 hover:text-red-300 cursor-pointer"
                                  onClick={() => handleRemoveSong(song.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove from playlist
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="bg-black/30 backdrop-blur-md border-gray-800 p-6 text-center">
                  <div className="py-8">
                    <div className="bg-black/50 p-3 rounded-full inline-block mb-4">
                      <Music className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-gray-300 text-lg mb-2">No songs in this playlist yet</p>
                    <p className="text-gray-500 text-sm mb-6">Add songs using the selector above</p>
                    <Button
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-white/10"
                      onClick={() => document.querySelector("select")?.focus()}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Your First Song
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Helper function to format file size
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}

export default PlaylistDetails
