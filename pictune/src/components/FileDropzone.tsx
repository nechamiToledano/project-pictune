"use client"

import type React from "react"

import { useState } from "react"
import { Music, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

export default function FileDropzone({ onFileSelect, selectedFile }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("audio/") || droppedFile.name.endsWith(".mp3")) {
        onFileSelect(droppedFile)
      } else {
        onFileSelect(null)
        // You could use toast here instead of alert
        alert("Please upload only music files")
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith("audio/") || selectedFile.name.endsWith(".mp3")) {
        onFileSelect(selectedFile)
      } else {
        onFileSelect(null)
        // You could use toast here instead of alert
        alert("Please upload only music files")
      }
    }
  }

  const removeFile = () => {
    onFileSelect(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out py-10 px-6
            ${
              isDragging
                ? "border-red-500 bg-gradient-to-r from-red-600/10 to-blue-600/10 scale-[1.02]"
                : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/30"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.m4a"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInputChange}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className={`p-3 rounded-full ${
                isDragging ? "bg-gradient-to-r from-red-600/20 to-blue-600/20" : "bg-gray-800"
              } transition-colors duration-300`}
            >
              <Upload className={`w-6 h-6 ${isDragging ? "text-white" : "text-gray-400"}`} />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-white">
                {isDragging ? "Drop to upload" : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-gray-400">MP3, WAV, OGG or M4A up to 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-700 rounded-xl p-4 bg-gray-800/30">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-gradient-to-r from-red-600/20 to-blue-600/20 mr-3">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium truncate text-white" dir="ltr">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-red-900/30 hover:text-red-400 text-gray-400"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

