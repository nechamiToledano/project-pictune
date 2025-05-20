"use client"

import { useState, useEffect, useRef, JSX } from "react"
import { ChevronDown, Music, Home, Sparkles, Upload, ListMusic, Heart, LogIn, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserProfileDialog from "./UserProfileDialog"
import { NavLink, Link } from "react-router-dom"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"

type NavItemProps = {
  to: string
  label?: string
  icon?: JSX.Element
  onClick?: () => void
  children?: React.ReactNode
}



const NavItem = ({ to, label, icon, onClick = () => { }, children }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `
        relative flex items-center gap-1 px-2 py-1 text-sm font-medium transition-all duration-300
        ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400" : "text-white"}
        hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-400 hover:to-blue-400
        after:block after:h-0.5 after:mt-1 after:transition-all
      `
      }
    >
      {children ? children : (<>{icon}{label}</>)}
    </NavLink>
  )
}

const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const libraryRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (libraryRef.current && !libraryRef.current.contains(event.target as Node)) {
        setIsLibraryOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 w-full text-white z-50 transition-all duration-300 ${isScrolled
      ? "bg-white-200/20  backdrop-blur-md py-3 shadow-xl border-b border-gray-800/50"
      : "bg-transparent py-5"
      }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="w-10 h-10 ">
                <div className="absolute inset-0.5  justify-center overflow-hidden">
                  <AvatarImage src="/logo.png" className="scale-110" />
                  <AvatarFallback className="bg-gray-900 text-white">P</AvatarFallback>
                </div>
              </Avatar>
            </motion.div>
          </Link>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400 ml-0">
            PicTune
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <NavItem to="/" label="Home" icon={<Home size={16} className="mr-1" />} />
              <NavItem to="/ai-playlist" label="AI Playlist" icon={<Sparkles size={16} className="mr-1" />} />
              <NavItem to="/upload" label="Upload" icon={<Upload size={16} className="mr-1" />} />
              <NavItem to="/song2clip" label="Song2Clip" icon={<Video size={16} className="mr-1" />} />

              <div ref={libraryRef} className="relative">
                <Button
                  variant="ghost"
                  className="text-white flex items-center gap-1 hover:text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400"
                  onClick={() => setIsLibraryOpen((prev) => !prev)}
                >
                  <Music size={16} className="mr-1" />
                  Library
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isLibraryOpen ? "rotate-180" : ""}`}
                  />
                </Button>

                {isLibraryOpen && (
                  <div className="absolute top-12 right-0 z-50 grid grid-cols-2 gap-4 p-6 w-[500px] bg-black border border-gray-800 rounded-xl shadow-2xl">
                    <NavItem to="/music" onClick={() => setIsLibraryOpen(false)}>
                      <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/10 transition">
                        <ListMusic size={24} className="text-red-400" />
                        <div>
                          <div className="font-semibold text-white">All Music</div>
                          <div className="text-sm text-gray-400">Explore the entire music collection.</div>
                        </div>
                      </div>
                    </NavItem>

                    <NavItem to="/music?owner=true" onClick={() => setIsLibraryOpen(false)}>
                      <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/10 transition">
                        <Music size={24} className="text-blue-400" />
                        <div>
                          <div className="font-semibold text-white">My Music</div>
                          <div className="text-sm text-gray-400">Manage the songs you've uploaded.</div>
                        </div>
                      </div>
                    </NavItem>

                    <NavItem to="/music?owner=true&favorites=true" onClick={() => setIsLibraryOpen(false)}>
                      <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/10 transition">
                        <Heart size={24} className="text-pink-400" />
                        <div>
                          <div className="font-semibold text-white">Favorites</div>
                          <div className="text-sm text-gray-400">Access your liked tracks quickly.</div>
                        </div>
                      </div>
                    </NavItem>

                    <NavItem to="/playlists" onClick={() => setIsLibraryOpen(false)}>
                      <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/10 transition">
                        <ListMusic size={24} className="text-green-400" />
                        <div>
                          <div className="font-semibold text-white">Playlists</div>
                          <div className="text-sm text-gray-400">Your custom playlists in one place.</div>
                        </div>
                      </div>
                    </NavItem>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <UserProfileDialog />
              </div>
            </>
          ) : (
            <NavItem to="/signin" label="Get Started" icon={<LogIn size={16} className="ml-1" />} />
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
