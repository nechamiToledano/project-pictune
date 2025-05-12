"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  Music,
  Home,
  Sparkles,
  Upload,
  ListMusic,
  Heart,
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
import { NavLink, Link } from "react-router-dom"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        relative flex items-center gap-1 px-2 py-1 text-sm font-medium transition-all duration-300
        ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400" : "text-white"}
        hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-400 hover:to-blue-400
        after:block after:h-0.5 after:mt-1 after:transition-all
       `
      }
    >
      {children}
    </NavLink>
  )
}

const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const [isScrolled, setIsScrolled] = useState(false)

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

          <div className="hidden md:flex items-center space-x-3">
            <NavItem to="/">
              <Home size={16} className="mr-1" /> Home
            </NavItem>

            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white flex items-center gap-1 hover:text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400"
                    >
                      Library <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-60 bg-gray-900/90 backdrop-blur-md border border-gray-800/50 rounded-xl shadow-xl shadow-black/20 text-white mt-2 p-2"
                    align="end"
                  >
                    <div className="text-xs uppercase text-gray-400 px-2 pb-1 border-b border-transparent bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                      Library
                    </div>
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-red-400 hover:to-blue-400 hover:text-white transition-all">
                        <Link to="/music" className="flex w-full items-center gap-2">
                          <ListMusic size={16} />
                          All Music
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-red-400 hover:to-blue-400 hover:text-white transition-all">
                        <Link to="/music?owner=true" className="flex w-full items-center gap-2">
                          <Music size={16} />
                          My Music
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-red-400 hover:to-blue-400 hover:text-white transition-all">
                        <Link to="/music?owner=true&favorites=true" className="flex w-full items-center gap-2">
                          <Heart size={16} />
                          Favorites
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-red-400 hover:to-blue-400 hover:text-white transition-all">
                        <Link to="/playlists" className="flex w-full items-center gap-2">
                          <ListMusic size={16} />
                          Playlists
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-gradient-to-r from-red-400 to-blue-400 h-[1px] my-2" />

                    <div className="text-xs uppercase text-gray-400 px-2 pb-1 border-b border-transparent bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                      Tools
                    </div>
                    <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-red-400 hover:to-blue-400 hover:text-white transition-all">
                      <Link to="/ai-playlist" className="flex w-full items-center gap-2">
                        <Sparkles size={16} className="text-red-400" />
                        AI Playlist Generator
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-red-400 hover:to-blue-400 hover:text-white transition-all">
                      <Link to="/upload" className="flex w-full items-center gap-2">
                        <Upload size={16} />
                        Upload New
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <NavItem to="/ai-playlist">
                  <Sparkles size={16} className="mr-1" /> AI Playlist
                </NavItem>

                <NavItem to="/upload">
                  <Upload size={16} className="mr-1" /> Upload
                </NavItem>

                <div className="ml-4">
                  <UserProfileDialog />
                </div>
              </>
            ) : (
              <>
                <NavItem to="/signin">
                  Get Started
                </NavItem>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
