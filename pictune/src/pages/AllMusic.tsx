"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Music, Search, Loader2, RefreshCw } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { fetchMusicFiles, type MusicFile } from "@/store/slices/musicFilesSlice"
import type { AppDispatch, RootState } from "@/store/store"
import AudioPlayer from "@/components/AudioPlayer"
import SearchBarDark from "@/components/SearchBar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Background from "@/components/Background"
import MusicCard from "@/components/MusicCard"

export default function AllMusic() {
  const dispatch = useDispatch<AppDispatch>()
  const { files: songs, loading, error } = useSelector((state: RootState) => state.musicFiles)
  const [currentPage, setCurrentPage] = useState(1)
  const [playingSong, setPlayingSong] = useState<MusicFile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "compact">("grid")
  const [retryCount, setRetryCount] = useState(0)

  // Adjust songs per page based on view
  const songsPerPage = view === "grid" ? 6 : 12

  // Extract tab or query params (e.g., 'favorites' or 'userName')
  const queryParams = new URLSearchParams(location.search)
  const isFavorites = queryParams.get("favorites") === "true"
  const owner = queryParams.get("owner") === "true"

  // Fetch music files based on the query params (favorites or userName)
  useEffect(() => {
    dispatch(fetchMusicFiles({ owner: owner || undefined, favorites: isFavorites }))
  }, [dispatch, isFavorites, owner, retryCount])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-red-500/10 rounded-lg blur-3xl"></div>
          <div className="relative bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-xl text-center">
            <div className="text-red-400 mb-4 flex justify-center">
              <RefreshCw className="h-16 w-16" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Music</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button
              onClick={() => setRetryCount((prev) => prev + 1)}
              className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const filteredSongs = songs.filter((song: MusicFile) =>
    song.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage)
  const indexOfLastSong = currentPage * songsPerPage
  const indexOfFirstSong = indexOfLastSong - songsPerPage
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on search
  }

  const handlePlayPause = (song: MusicFile) => {
    if (playingSong && playingSong.id === song.id) {
      setPlayingSong(null)
    } else {
      setPlayingSong(song)
    }
  }

  const handleNextSong = () => {
    if (!playingSong) return

    const currentIndex = filteredSongs.findIndex((song) => song.id === playingSong.id)
    if (currentIndex < filteredSongs.length - 1) {
      setPlayingSong(filteredSongs[currentIndex + 1])
    }
  }

  const handlePreviousSong = () => {
    if (!playingSong) return

    const currentIndex = filteredSongs.findIndex((song) => song.id === playingSong.id)
    if (currentIndex > 0) {
      setPlayingSong(filteredSongs[currentIndex - 1])
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 pb-20">
      <Background />

      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`pb-${playingSong ? "24" : "0"} md:pb-${playingSong ? "20" : "0"}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 p-3 rounded-full shadow-lg">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                {owner ? "My Music" : isFavorites ? "My Favorites" : "Music Collection"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Tabs defaultValue="grid" value={view} onValueChange={(v) => setView(v as "grid" | "compact")}>
                <TabsList className="bg-black/30 border border-gray-800">
                  <TabsTrigger
                    value="grid"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-grid"
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                  </TabsTrigger>
                  <TabsTrigger
                    value="compact"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-list"
                    >
                      <line x1="8" x2="21" y1="6" y2="6" />
                      <line x1="8" x2="21" y1="12" y2="12" />
                      <line x1="8" x2="21" y1="18" y2="18" />
                      <line x1="3" x2="3.01" y1="6" y2="6" />
                      <line x1="3" x2="3.01" y1="12" y2="12" />
                      <line x1="3" x2="3.01" y1="18" y2="18" />
                    </svg>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                asChild
                className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
              >
                <Link to="/upload-music">Upload Music</Link>
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <SearchBarDark onSearch={handleSearch} />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                <Loader2 className="h-16 w-16 text-white animate-spin relative" />
              </div>
              <p className="mt-4 text-white text-lg">Loading your music collection...</p>
            </div>
          ) : (
            <>
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                }
              >
                {currentSongs.map((song: MusicFile, index) => (
                  <MusicCard
                    key={song.id}
                    song={song}
                    index={index}
                    isPlaying={playingSong?.id === song.id}
                    onPlayPause={() => handlePlayPause(song)}
                  />
                ))}
              </div>

              {filteredSongs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl max-w-md shadow-xl border border-gray-800">
                    {searchQuery ? (
                      <>
                        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
                        <p className="text-gray-400 mb-6">Try a different search term or clear your search.</p>
                        <Button
                          onClick={() => handleSearch("")}
                          className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                        >
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <>
                        <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Your Music Collection is Empty</h2>
                        <p className="text-gray-400 mb-6">Upload your first music file to get started.</p>
                        <Button
                          asChild
                          className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                        >
                          <Link to="/upload-music">Upload Music</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent className="bg-black/40 backdrop-blur-md rounded-lg p-1 shadow-md border border-gray-800">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1 ? "text-gray-600 cursor-not-allowed" : "text-white hover:bg-white/10"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                        className={
                          index + 1 === currentPage
                            ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 text-white"
                            : "text-white hover:bg-white/10"
                        }
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages ? "text-gray-600 cursor-not-allowed" : "text-white hover:bg-white/10"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </motion.div>
      </div>

      {/* Global Audio Player */}
      {playingSong && (
        <AudioPlayer
          song={playingSong}
          onClose={() => setPlayingSong(null)}
          onNext={
            filteredSongs.findIndex((song) => song.id === playingSong.id) < filteredSongs.length - 1
              ? handleNextSong
              : undefined
          }
          onPrevious={
            filteredSongs.findIndex((song) => song.id === playingSong.id) > 0 ? handlePreviousSong : undefined
          }
        />
      )}
    </section>
  )
}
