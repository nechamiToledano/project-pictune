"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  Music,
  User,
  Home,
  Menu,
  Sparkles,
  Upload,
  ListMusic,
  Heart,
  LogOut,
  Settings,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import UserProfileDialog from "./UserProfileDialog"
import { Link } from "react-router-dom"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"

const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const [isScrolled, setIsScrolled] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full text-white z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/80 backdrop-blur-md py-3 shadow-lg border-b border-gray-800/50"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Avatar className="w-10 h-10 ">
                  <div className="absolute inset-0.5  justify-center overflow-hidden">
                    <AvatarImage src="/logo.png" className="scale-110" />
                    <AvatarFallback className="bg-gray-900 text-white">PT</AvatarFallback>
                  </div>
                </Avatar>
              </motion.div>
            </Link>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400 ml-0">
              PicTune
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/">
              <Button
                variant="ghost"
                className="rounded-full px-4 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <Home size={18} className="mr-2" />
                Home
              </Button>
            </Link>

            {isLoggedIn ? (
              <>
                {/* Music Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full px-4 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    >
                      <Music size={18} className="mr-2" />
                      Music
                      <ChevronDown size={16} className="ml-2 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900/90 backdrop-blur-md border border-gray-800/50 rounded-xl shadow-xl shadow-black/20 text-white mt-2 p-1">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="rounded-lg hover:bg-white/10 cursor-pointer focus:bg-white/10">
                        <Link to="/music" className="flex w-full py-1 items-center gap-2">
                          <ListMusic size={16} />
                          All Music
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg hover:bg-white/10 cursor-pointer focus:bg-white/10">
                        <Link to={`/music?owner=true`} className="flex w-full py-1 items-center gap-2">
                          <Music size={16} />
                          My Music
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg hover:bg-white/10 cursor-pointer focus:bg-white/10">
                        <Link to={`/music?owner=true&favorites=true`} className="flex w-full py-1 items-center gap-2">
                          <Heart size={16} />
                          Favorites
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg hover:bg-white/10 cursor-pointer focus:bg-white/10">
                        <Link to="/playlists" className="flex w-full py-1 items-center gap-2">
                          <ListMusic size={16} />
                          Playlists
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-white/10 my-1" />
                    <DropdownMenuItem className="rounded-lg hover:bg-white/10 cursor-pointer focus:bg-white/10">
                      <Link to="/ai-playlist" className="flex w-full py-1 items-center gap-2">
                        <Sparkles size={16} className="text-red-400" />
                        AI Playlist Generator
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg hover:bg-white/10 cursor-pointer focus:bg-white/10">
                      <Link to="/upload" className="flex w-full py-1 items-center gap-2">
                        <Upload size={16} />
                        Upload New
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/ai-playlist">
                  <Button
                    variant="ghost"
                    className="rounded-full px-4 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles size={18} className="mr-2 text-red-400" />
                    AI Playlist
                  </Button>
                </Link>

                <Button className="ml-2 bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-0">
                  <Link to="/upload" className="flex items-center">
                    <Upload size={18} className="mr-2" />
                    Upload
                  </Link>
                </Button>
                <div className="ml-5 mr-5">
                  <UserProfileDialog />
                </div>
              </>
            ) : (
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full px-4 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    >
                      <User size={18} className="mr-2" />
                      Account
                      <ChevronDown size={16} className="ml-2 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900/90 backdrop-blur-md border border-gray-800/50 rounded-xl shadow-xl shadow-black/20 text-white mt-2 p-1">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="rounded-lg hover:bg-white/10 cursor-pointer focus:bg-white/10">
                        <Link to="/signin" className="flex w-full py-1 items-center gap-2">
                          <LogOut size={16} />
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg hover:bg-white/10 cursor-pointer focus:bg-white/10">
                        <Link to="/signup" className="flex w-full py-1 items-center gap-2">
                          <User size={16} />
                          Sign Up
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className="ml-2 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-0">
                  <Link to="/signin">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gray-900/90 backdrop-blur-md border-l border-gray-800/50 text-white p-0"
              >
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-500 to-blue-500 p-0.5">
                        <div className="absolute inset-0.5 rounded-lg bg-gray-900/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                          <AvatarImage src="/logo.png" className="scale-110" />
                          <AvatarFallback className="bg-gray-900 text-white">PT</AvatarFallback>
                        </div>
                      </Avatar>
                      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                        PicTune
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto py-6 px-4 flex flex-col gap-2">
                    <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                      <Home size={20} />
                      <span>Home</span>
                    </Link>

                    {isLoggedIn ? (
                      <>
                        <div className="mt-4 mb-2 text-sm font-medium text-gray-400 flex items-center gap-2">
                          <Music size={14} />
                          MUSIC
                        </div>
                        <Link
                          to="/music"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <ListMusic size={20} />
                          <span>All Music</span>
                        </Link>
                        <Link
                          to="/music?owner=true"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Music size={20} />
                          <span>My Music</span>
                        </Link>
                        <Link
                          to="/music?owner=true&favorites=true"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Heart size={20} />
                          <span>Favorites</span>
                        </Link>
                        <Link
                          to="/playlists"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <ListMusic size={20} />
                          <span>Playlists</span>
                        </Link>

                        <div className="mt-4 mb-2 text-sm font-medium text-gray-400 flex items-center gap-2">
                          <Sparkles size={14} className="text-red-400" />
                          AI FEATURES
                        </div>
                        <Link
                          to="/ai-playlist"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Sparkles size={20} className="text-red-400" />
                          <span>AI Playlist Generator</span>
                          <Badge className="ml-auto bg-red-500/20 text-red-300 border-red-500/30 text-xs">New</Badge>
                        </Link>

                        <div className="mt-4 mb-2 text-sm font-medium text-gray-400 flex items-center gap-2">
                          <Settings size={14} />
                          ACTIONS
                        </div>
                        <Link
                          to="/upload"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Upload size={20} />
                          <span>Upload Music</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Settings size={20} />
                          <span>Settings</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="mt-4 mb-2 text-sm font-medium text-gray-400 flex items-center gap-2">
                          <User size={14} />
                          ACCOUNT
                        </div>
                        <Link
                          to="/signin"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <LogOut size={20} />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          to="/signup"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <User size={20} />
                          <span>Sign Up</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-800/50">
                    {isLoggedIn ? (
                      <Button className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 rounded-full">
                        <Link to="/upload" className="flex items-center justify-center w-full gap-2">
                          <Upload size={18} />
                          Upload Music
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 rounded-full">
                        <Link to="/signin" className="flex items-center justify-center w-full">
                          Get Started
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
