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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import Background from "./Background"

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const playlist = useSelector((state: RootState) => selectPlaylistWithSongs(state, id || ""))
  const [availableSongs, setAvailableSongs] = useState<MusicFile[]>([])
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [_, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSongUrl, setCurrentSongUrl] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false)
  const [playlistName, setPlaylistName] = useState(playlist?.name || "")
  const [playlistDescription, setPlaylistDescription] = useState(playlist?.description || "")
  const [isUpdating, setIsUpdating] = useState(false)
  
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
    if (playlist && playlist.songs) {
        try {
            const songUrls = await Promise.all(
                playlist.songs.map(async (song) => {
                    const result = await dispatch(fetchMusicFileUrl(song.id) as any);
                    return result.payload; // Assuming fetchMusicFileUrl returns a URL as payload
                })
            );
            playSongs(songUrls.filter(Boolean)); // Play songs that successfully fetched URLs
        } catch (error) {
            console.error("Error playing songs:", error);
            toast.error("Failed to play songs");
        }
    }
};
const playSongs = (urls: string[], startIndex: number = 0) => {
  if (urls.length === 0) {
      toast.error("אין שירים להשמיע");
      return;
  }

  if (audioPlayer) {
      audioPlayer.pause();
  }

  const audio = new Audio();
  setAudioPlayer(audio);
  setCurrentSongIndex(startIndex);
  setIsPlaying(true);

  const playNextSong = (index: number) => {
      if (index >= urls.length) {
          toast.success("כל השירים הושמעו");
          setIsPlaying(false);
          return;
      }

      const url = urls[index];
      audio.src = url;
      audio.play().then(() => {
          setCurrentSongUrl(url);
          setCurrentSongIndex(index);
          setIsPlaying(true);
      }).catch(error => console.error("שגיאה בהפעלה:", error));

      audio.onended = () => playNextSong(index + 1);
  };

  playNextSong(startIndex);
};

const pauseSong = () => {
  if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
  }
};

const resumeSong = () => {
  if (audioPlayer && currentSongUrl) {
      audioPlayer.play().then(() => setIsPlaying(true)).catch(error => console.error("שגיאה בהמשך ההפעלה:", error));
  }
};

const stopSong = () => {
  if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      setIsPlaying(false);
      setCurrentSongUrl(null);
  }
};

  const handleAddSong = async () => {
    if (id && selectedSongId) {
      await dispatch(addSongToPlaylist({ playlistId: id, songId: selectedSongId }))
      dispatch(fetchPlaylistById(id));

      toast.success("Song added to playlist")

      setSelectedSongId(null)
    } else {
      toast.error("Please select a song to add")
    }
  }

  const handleRemoveSong = (songId: number) => {
    if (id) {
      dispatch(removeSongFromPlaylist({ playlistId: id, songId }))
      toast.success("Song removed from playlist")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin">
            <Music className="h-8 w-8" />
          </div>
          Loading playlist...
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl max-w-md text-center border border-gray-800">
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
          <h2 className="text-xl font-bold text-white mb-2">Playlist Not Found</h2>
          <p className="text-gray-400">The playlist you're looking for could not be found.</p>
          <Button
            onClick={() => navigate("/playlists")}
            className="mt-4 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
          >
            Back to Playlists
          </Button>
        </div>
      </div>
    )
  }



  const handleEdit = () => {
    setEditMode(true)
  }

  const handleSave = async () => {
    if (id && playlistName) {
      setIsUpdating(true)
      try {
        await dispatch(updatePlaylist({ id, name: playlistName, description: playlistDescription }))
        toast.success("Playlist updated successfully")
        setEditMode(false) // Exit edit mode
      } catch (error) {
        toast.error("Failed to update playlist")
      } finally {
        dispatch(fetchPlaylistById(id));

        setIsUpdating(false)
      }
    } else {
      toast.error("Please provide a valid name for the playlist")
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    setPlaylistName(playlist?.name || "") // Reset to the original name
    setPlaylistDescription(playlist?.description || "") // Reset to the original description
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 pb-20 bg-gradient-to-br from-black via-black/90 to-black/80">
    <Background/>
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Button
            variant="ghost"
            onClick={() => navigate("/playlists")}
            className="mb-6 text-white hover:text-white hover:bg-white/20 self-start"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Playlists
          </Button>

          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-square relative rounded-xl overflow-hidden bg-black/30 backdrop-blur-md shadow-2xl mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ListMusic className="h-24 w-24 text-white/50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  {editMode ? (
                    <input
                      type="text"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      className="text-2xl font-bold text-white bg-transparent border-b-2 border-white focus:outline-none focus:ring-0"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
                  )}
                  <p className="text-gray-300 text-sm">{playlist.songs.length} songs</p>
                </div>
              </div>


              <div className="flex flex-col gap-2 mb-6 w-full">                
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
                  onClick={() => handlePlayAll()}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                    Pause
                  </Button>

                  <Button
                    variant="outline"
                    className={`border-gray-700 ${!isPlaying && currentSongUrl ? "text-white hover:bg-white/10" : "text-gray-500 cursor-not-allowed"}`}
                    onClick={resumeSong}
                    disabled={isPlaying || !currentSongUrl}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Resume
                  </Button>

                  <Button
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                    onClick={stopSong}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                    Stop
                  </Button>
                </div>
                {!editMode && (
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-white hover:bg-white/10"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>)}
                {editMode && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 hover:from-green-700 hover:to-blue-700 text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 text-white">
                    Cancel
                  </Button>
                </div>
              )}
              
              </div>
              
              {editMode ? (
                    <input
                      type="text"
                      value={playlistDescription}
                      onChange={(e) => setPlaylistDescription(e.target.value)}
                      className="text-2xl font-bold text-white bg-transparent border-b-2 border-white focus:outline-none focus:ring-0"
                    />
                  ) : (
                    playlist.description&&
                <Card className="bg-black/30 backdrop-blur-md border-gray-800 mb-6">
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold mb-2">Description</h3>
                    <p className="text-gray-400">{playlist.description}</p>
                  </CardContent>
                </Card>
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
                            {song.fileName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddSong}
                      className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Song
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-xl font-semibold text-white mb-4">Songs in Playlist</h2>

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
                                <p className="text-white font-medium">{song.fileName}</p>
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
                  <p className="text-gray-400">No songs in this playlist yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Add songs using the selector above.</p>
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

