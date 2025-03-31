"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Music,  Search } from "lucide-react"
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
import MusicCard from "@/components/MusicCard"
import SearchBarDark from "@/components/SearchBar"
import Background from "./Background"


export default function AllMusic() {
  const dispatch = useDispatch<AppDispatch>()
  const { files: songs, loading, error } = useSelector((state: RootState) => state.musicFiles)
  const [currentPage, setCurrentPage] = useState(1)
  const [playingSong, setPlayingSong] = useState<MusicFile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const songsPerPage = 6

  // Extract tab or query params (e.g., 'favorites' or 'userName')
  const queryParams = new URLSearchParams(location.search)
  const isFavorites = queryParams.get("favorites") === "true"
  const owner = queryParams.get("owner")=== "true"

  // Fetch music files based on the query params (favorites or userName)
  useEffect(() => {
    dispatch(fetchMusicFiles({ owner:owner||undefined,favorites: isFavorites,  }))
  }, [dispatch, isFavorites, owner])



  if (error)
    return <div>Error: {error}</div>



  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin">
            <Music className="h-8 w-8 text-red-500" />
          </div>
          Loading your music collection...
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl max-w-md text-center border border-gray-800 shadow-xl">
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
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Music</h2>
          <p className="text-gray-400">{error}</p>
          <Button
            onClick={() => dispatch(fetchMusicFiles({ owner:owner||undefined,favorites: isFavorites}))
          }
            className="mt-4 bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )

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
      {/* Background Image */}
     <Background/>
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`pb-${playingSong ? "24" : "0"} md:pb-${playingSong ? "20" : "0"}`}
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 p-3 rounded-full shadow-lg">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">My Music Collection</h1>
          </div>

          <div className="mb-8">
            <SearchBarDark onSearch={handleSearch} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

