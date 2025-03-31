"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, FolderPlus } from "lucide-react"
import {  
  addSongToPlaylist, 
  createPlaylist, 
  selectPlaylists, 
  fetchPlaylists, 
  PlaylistType
} from "@/store/slices/playlistsSlice"
import type { AppDispatch } from "@/store/store"
import type { MusicFile } from "@/store/slices/musicFilesSlice"
import { Input } from "@/components/ui/input"

interface AddToPlaylistDialogProps {
  song: MusicFile
  trigger?: React.ReactNode
}

export default function AddToPlaylistDialog({ song, trigger }: AddToPlaylistDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const playlists = useSelector(selectPlaylists)
  const [isOpen, setIsOpen] = useState(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")

  // Fetch playlists when the component mounts
  useEffect(() => {
    dispatch(fetchPlaylists())
  }, [dispatch])

  const handleAddToPlaylist = (playlistId: string) => {
    dispatch(addSongToPlaylist({ playlistId, songId: song.id }))
    setIsOpen(false)
  }

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      const action = dispatch(createPlaylist({ name: newPlaylistName }))
      const newPlaylistId = (await action).payload.id
      dispatch(addSongToPlaylist({ playlistId: newPlaylistId, songId: song.id }))
      setNewPlaylistName("")
      setIsCreatingPlaylist(false)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-white border-gray-700 hover:bg-white/10">
            <Plus className="h-4 w-4 mr-1" /> Add to Playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-black/80 backdrop-blur-md border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a playlist to add "{song.fileName}" to.
          </DialogDescription>
        </DialogHeader>

        {isCreatingPlaylist ? (
          <div className="py-4">
            <div className="mb-4">
              <label htmlFor="new-playlist" className="text-sm text-gray-400 mb-2 block">
                New Playlist Name
              </label>
              <Input
                id="new-playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                className="bg-black/50 border-gray-700"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreatingPlaylist(false)}
                className="border-gray-700 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePlaylist}
                className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700"
                disabled={!newPlaylistName.trim()}
              >
                Create & Add
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-72 overflow-y-auto pr-4">
              <div className="space-y-2">
                {playlists.length > 0 ? (
                  playlists.map((playlist: PlaylistType) => (
                    <div
                      key={playlist.id}
                      className="p-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-between"
                      onClick={() => handleAddToPlaylist(playlist.id)}
                    >
                      <div>
                        <h4 className="font-medium">{playlist.name}</h4>
                        <p className="text-sm text-gray-400">{playlist.songs.length} songs</p>
                      </div>
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No playlists found.</p>
                )}
              </div>
            </ScrollArea>

            <DialogFooter className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setIsCreatingPlaylist(true)}
                className="border-gray-700 text-white hover:bg-white/10"
              >
                <FolderPlus className="h-4 w-4 mr-1" /> New Playlist
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-gray-700 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
