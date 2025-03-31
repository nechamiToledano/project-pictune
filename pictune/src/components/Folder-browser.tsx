"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FolderPlus, ChevronRight, MoreHorizontal, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import {   createFolderAsync, deleteFolderAsync, FolderType, selectCurrentFolder, selectFolders, setCurrentFolder } from "@/store/slices/folderSlice"
import { AppDispatch, RootState } from "@/store/store"
import {  PlaylistType, selectPlaylistsInCurrentFolder } from "@/store/slices/playlistsSlice"

export default function FolderBrowser() {
  const dispatch = useDispatch<AppDispatch>()
  const folders :FolderType[]= useSelector(selectFolders)
  const currentFolder :FolderType |null= useSelector(selectCurrentFolder)
  const playlists: PlaylistType[] = useSelector((state: RootState) => selectPlaylistsInCurrentFolder(state))

  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderDescription, setNewFolderDescription] = useState("")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      dispatch(
        createFolderAsync({
          
          name: newFolderName,
          description: newFolderDescription,
         
        })
      );
      
      setNewFolderName("")
      setNewFolderDescription("")
      setIsCreateFolderOpen(false)
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm("Are you sure you want to delete this folder?")) {
      dispatch(deleteFolderAsync(folderId))
    }
  }

  const navigateToFolder = (folderId: string) => {
    dispatch(setCurrentFolder(folderId))
  }

  const getBreadcrumbPath = () => {
    const path = []
    let current = currentFolder
    while (current) {
      path.unshift(current)
      if (current.id === "root" || !current.parentFolderId) break
      current = folders.find((f:FolderType) => f.id === current?.parentFolderId) !!
    }
    return path
  }

  const breadcrumbPath = getBreadcrumbPath()
  const childFolders = folders.filter((f:FolderType) => f.parentFolderId === currentFolder?.id)

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl border border-gray-800 p-4 mb-8">
      {/* Breadcrumb navigation */}
      <div className="flex items-center flex-wrap gap-1 mb-4 text-sm text-gray-400">
        {breadcrumbPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center">
            {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
            <button
              onClick={() => navigateToFolder(folder.id)}
              className={cn("hover:text-white transition-colors", folder.id === currentFolder?.id ? "text-white font-medium" : "")}
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{currentFolder?.name}</h3>
        <div className="flex gap-2">
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-white border-gray-700 hover:bg-white/10">
                <FolderPlus className="h-4 w-4 mr-1" /> New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/80 backdrop-blur-md border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Folder Name</Label>
                  <Input
                    id="name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="bg-black/50 border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                    className="bg-black/50 border-gray-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateFolderOpen(false)}
                  className="border-gray-700 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateFolder}
                  className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700"
                >
                  Create Folder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Folder items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {childFolders.map((folder:FolderType) => (
          <div key={folder.id} className="group">
            <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 p-3 hover:bg-black/60 transition-all cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 flex flex-col items-center text-center"
                  onClick={() => navigateToFolder(folder.id)}
                >
                  <Folder className="h-16 w-16 text-yellow-500 mb-2" />
                  <h4 className="text-white font-medium text-sm truncate w-full">{folder.name}</h4>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-md border-gray-800 text-white">
                    <DropdownMenuItem
                      onClick={() => handleDeleteFolder(folder.id)}
                    >
                      Delete Folder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
  {playlists.map((playlist: PlaylistType) => (
    <div key={playlist.id} className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-800 p-3 hover:bg-black/60 transition-all cursor-pointer h-full">
      <h4 className="text-white font-medium text-sm truncate w-full">{playlist.name}</h4>
    </div>
  ))}
</div>


          </div>
          
        ))}
      </div>
      
    </div>
    
  )
}
