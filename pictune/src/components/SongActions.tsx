"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Heart, Share2, Download, Mail, X, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "./Api"
import { fetchMusicFileUrl, type MusicFile, toggleLikeMusicFile } from "@/store/slices/musicFilesSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { motion, AnimatePresence } from "framer-motion"

const SongActions = ({ song }: { song: MusicFile }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { songUrl } = useSelector((state: RootState) => state.musicFiles)
  const [email, setEmail] = useState("")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayTooltip, setShowPlayTooltip] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (song.id) {
      dispatch(fetchMusicFileUrl(song.id))
    }
  }, [dispatch, song.id])

  // Toggle like status
  const toggleLike = () => {
    dispatch(toggleLikeMusicFile(song.id))

    // Show heart animation
    const heart = document.createElement("div")
    heart.className = "absolute text-red-500 animate-float-up"
    heart.innerHTML = "❤️"
    heart.style.left = `${Math.random() * 20 + 40}%`
    heart.style.top = "50%"
    document.body.appendChild(heart)

    setTimeout(() => {
      document.body.removeChild(heart)
    }, 1000)
  }

  const downloadSong = () => {
    const { songUrl } = useSelector((state: RootState) => state.musicFiles);
  
    if (!song || !songUrl) { // ודא שגם songUrl קיים
      console.error("No song or song URL available for download.");
      toast.error("Download failed", { description: "Song not available for download." });
      return;
    }
  
    // הצג הודעת הורדה
    toast.success("Download started", {
      description: song.fileName,
      icon: <Download className="h-4 w-4" />,
    });
  
    const a = document.createElement("a");
    // השתמש ב-songUrl המלא שאתה מקבל מהשרת האחורי
    a.href = songUrl; // זה התיקון המרכזי
    a.download = song.fileName; // שם הקובץ שיוצג למשתמש
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
  };
  
  // Set up audio when song URL is available
  useEffect(() => {
    if (audioRef.current && songUrl) {
      audioRef.current.src = songUrl
      audioRef.current.addEventListener("ended", () => setIsPlaying(false))

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", () => setIsPlaying(false))
        }
      }
    }
  }, [songUrl])

  // Send song to email
  const sendToEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    if (!songUrl) {
      toast.error("Failed to retrieve the song URL. Please try again.")
      return
    }

    setIsSending(true)

    try {
      const response = await api.post("email/send-song-link", {
        Email: email,
        songUrl: songUrl,
      })

      if (response.data.success) {
        toast.success("Email sent successfully!")
        setIsShareModalOpen(false)
        setEmail("")
      } else {
        toast.error(response.data.message || "Failed to send email.")
      }
    } catch (error) {
      toast.error("Failed to send email.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex items-center justify-center gap-3 relative">
      <audio ref={audioRef} className="hidden" />

      {/* Like Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-all duration-300",
            song.isLiked && "text-red-500 hover:text-red-400 border-red-500/30",
          )}
          onClick={toggleLike}
        >
          <Heart className={cn("h-5 w-5", song.isLiked && "fill-current")} />
        </Button>
      </motion.div>

      {/* Share Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
          onClick={() => setIsShareModalOpen(true)}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Download Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
          onClick={downloadSong}
        >
          <Download className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Play Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setShowPlayTooltip(true)}
        onHoverEnd={() => setShowPlayTooltip(false)}
        className="relative"
      >


        <AnimatePresence>
          {showPlayTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap"
            >
              {isPlaying ? "Pause" : "Play"} music
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-md border border-gray-800 sm:max-w-md shadow-xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-blue-600"></div>

          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                Share Music
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => setIsShareModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-gray-400 mt-2">
              Send "{song.fileName}" to an email address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg border border-white/5">
              <Mail className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Enter recipient's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gradient-to-r from-red-600/20 to-blue-600/20">
                  <Volume2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">{song.fileName}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(song.size)}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              onClick={() => setIsShareModalOpen(false)}
              variant="outline"
              className="border-gray-700 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={sendToEmail}
              disabled={isSending || !email}
              className={cn(
                "relative overflow-hidden",
                isSending
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white",
              )}
            >
              {isSending ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin mr-2 h-4 w-4 text-white"
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
                  Sending...
                </div>
              ) : (
                <>
                  <span className="relative z-10">Send</span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS for heart animation */}
      <style  >{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
          }
        }
        .animate-float-up {
          position: fixed;
          font-size: 24px;
          animation: float-up 1s ease-out forwards;
          z-index: 9999;
        }
      `}</style>
    </div>
  )
}

// Helper function to format file size
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}

export default SongActions

