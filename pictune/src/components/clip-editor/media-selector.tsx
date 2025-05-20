"use client"

import type React from "react"

import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { X, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MusicFile } from "@/store/slices/musicFilesSlice"

interface MediaSelectorProps {
  mediaFiles: File[]
  setMediaFiles: (files: File[]) => void
  isVideo: boolean
  setIsVideo: (isVideo: boolean) => void
  selectedSong: MusicFile | null
  setSelectedSong: (song: MusicFile | null) => void
}

export default function MediaSelector({
  mediaFiles,
  setMediaFiles,
  isVideo,
  setIsVideo,
  selectedSong,
  setSelectedSong,
}: MediaSelectorProps) {
  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)
    setIsVideo(files[0].type.startsWith("video/"))
    setMediaFiles(files)
  }

  const removeFile = (index: number) => {
    const newFiles = [...mediaFiles]
    newFiles.splice(index, 1)
    setMediaFiles(newFiles)
    if (newFiles.length === 0) {
      setIsVideo(false)
    }
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(mediaFiles)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)
    setMediaFiles(items)
  }

  const clearSelection = () => {
    setMediaFiles([])
    setSelectedSong(null)
  }

  return (
    <div className="space-y-4">
      {selectedSong && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h3 className="font-medium text-white">{selectedSong.fileName}</h3>
                <p className="text-xs text-gray-400">שיר נבחר</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSong(null)}
              className="hover:bg-red-500/20 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="file-upload" className="block">
            העלאת וידאו או תמונות
          </Label>
          {mediaFiles.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              נקה בחירה
            </Button>
          )}
        </div>
        <div className="flex">
          <Input
            id="file-upload"
            type="file"
            accept="video/*,image/*"
            multiple
            onChange={onFilesSelected}
            className="bg-gray-800/50 border-gray-700/50 text-white"
          />
        </div>
      </div>

      {mediaFiles.length > 0 && !isVideo && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="block">סדר תמונות</Label>
            <Badge variant="outline" className="bg-gray-800/50 border-gray-700/50">
              {mediaFiles.length} תמונות
            </Badge>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-2 p-2 bg-gray-800/30 rounded-md min-h-[100px] border border-gray-700/50"
                >
                  {mediaFiles.map((file, index) => (
                    <Draggable key={file.name} draggableId={file.name} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative flex-shrink-0 group"
                        >
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`img-${index}`}
                            className="w-24 h-24 object-cover rounded-md border border-gray-700/50"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1">
                            {index + 1}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {isVideo && mediaFiles.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60"
                >
                  <path d="m22 8-6 4 6 4V8Z" />
                  <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">{mediaFiles[0].name}</h3>
                <p className="text-xs text-gray-400">וידאו נבחר</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMediaFiles([])}
              className="hover:bg-red-500/20 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="bg-gray-800/20 border border-gray-700/30 rounded-lg p-3 mt-4">
        <p className="text-xs text-gray-400">
          טיפ: ניתן להעלות וידאו או מספר תמונות. אם תבחר גם שיר וגם מדיה חזותית, הקליפ ייווצר עם השיר כפסקול.
        </p>
      </div>
    </div>
  )
}
