import { Clock, Calendar, FileAudio } from "lucide-react"
import type { MusicFile } from "@/store/slices/musicFilesSlice"

export default function SongInfo({ song }: { song: MusicFile }) {
  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-3">File Information</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white/80">
            <FileAudio className="h-4 w-4 mr-2" />
            Type:
          </div>
          <span className="text-white">{song.fileType}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white/80">
            <Calendar className="h-4 w-4 mr-2" />
            Uploaded:
          </div>
          <span className="text-white">{new Date(song.uploadedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white/80">
            <Clock className="h-4 w-4 mr-2" />
            Size:
          </div>
          <span className="text-white">{formatFileSize(song.size)}</span>
        </div>
      </div>
    </div>
  )
}

// Helper function to format file size
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}

