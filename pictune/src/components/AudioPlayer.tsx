// AudioPlayer.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { fetchImage, fetchMusicFileUrl, type MusicFile } from "@/store/slices/musicFilesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

interface AudioPlayerProps {
  song: MusicFile | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function AudioPlayer({ song, onClose, onNext, onPrevious }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false); // New state to track if audio element is ready
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { songUrl } = useSelector((state: RootState) => state.musicFiles);
  const imageUrl = useSelector((state: RootState) => state.musicFiles.images[song?.s3Key || '']);

  // Effect to fetch image for the song thumbnail
  useEffect(() => {
    if (song?.s3Key && !imageUrl) {
      dispatch(fetchImage(song.s3Key));
    }
  }, [dispatch, song?.s3Key, imageUrl]);

  // Define stable event handlers using useCallback
  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsAudioLoaded(true); // Mark audio as loaded
      // Try to play only after metadata is loaded
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio after loadedmetadata (autoplay blocked?):", error);
          setIsPlaying(false);
        });
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onNext) {
      onNext(); // Call the onNext prop directly
    }
  }, [onNext]); // Dependency: onNext

  // Effect to fetch music file URL and manage audio element lifecycle
  useEffect(() => {
    // Cleanup function for previous audio instance if song changes or component unmounts
    const cleanupAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ""; // Clear the source
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current = null;
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsAudioLoaded(false); // Reset loaded state
    };

    if (!song?.id) {
      cleanupAudio();
      return;
    }

    // Dispatch fetching of music file URL
    dispatch(fetchMusicFileUrl(Number(song.id)));

    return cleanupAudio; // Return cleanup function
  }, [song?.id, dispatch, updateProgress, handleLoadedMetadata, handleEnded]); // Include stable callbacks here

  // Effect to create and manage the audio element when songUrl is available
  useEffect(() => {
    console.log("Attempting to load audio from 1:", songUrl); // הוסף את זה

    if (songUrl) {

      // Clean up previous audio instance before creating a new one
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current = null;
      }
      console.log("Attempting to load audio from:", songUrl); // הוסף את זה

      console.log("Creating new Audio element for:", songUrl); // Debug log
      const audio = new Audio(songUrl);
      audioRef.current = audio;

      // Attach event listeners
      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);

      audio.volume = volume;
      audio.load(); // Ensure the audio element loads the new source
    }
  }, [songUrl, volume, updateProgress, handleLoadedMetadata, handleEnded]); // Dependencies: songUrl, volume, and stable callbacks

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.log("Audio element not ready. Cannot toggle play. (Ref is null)"); // More specific message
      // Potentially disable the button until `isAudioLoaded` is true
      return;
    }

    // If the audio element is present but not yet loaded metadata, warn
    if (!isAudioLoaded) {
      console.log("Audio element exists but metadata not loaded yet. Cannot toggle play."); // More specific message
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio on toggle:", error);
          setIsPlaying(false);
        });
    }
  };

  if (!song) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-gray-800"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Song thumbnail and info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative h-14 w-14 rounded-md overflow-hidden flex-shrink-0 bg-black/50">
                <img
                  src={imageUrl || "/logo.png"}
                  alt={song.displayName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-medium truncate">{song.displayName}</h4>
                <p className="text-gray-400 text-sm truncate">
                  {formatFileSize(song.size)} • {new Date(song.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex flex-col items-center gap-1 flex-1">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-white hover:bg-white/10"
                  onClick={onPrevious}
                  disabled={!onPrevious || !isAudioLoaded} // Disable if not loaded
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-full",
                    isPlaying
                      ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 text-white hover:from-red-700 hover:to-blue-700"
                      : "text-white hover:bg-white/10",
                  )}
                  onClick={togglePlay}
                  disabled={!isAudioLoaded} // Disable until audio is loaded
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-white hover:bg-white/10"
                  onClick={onNext}
                  disabled={!onNext || !isAudioLoaded} // Disable if not loaded
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 w-full max-w-md">
                <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="flex-1"
                  disabled={!isAudioLoaded} // Disable slider if not loaded
                />
                <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume and additional controls (desktop only) */}
            <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
              <div className="flex items-center gap-2 w-32">
                <Volume2 className="h-4 w-4 text-gray-400" />
                <Slider value={[volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} disabled={!isAudioLoaded} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
}