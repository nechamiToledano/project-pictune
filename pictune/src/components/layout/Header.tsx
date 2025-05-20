"use client"

import type React from "react"

import { useState } from "react"
import { Menu, User } from "lucide-react"
import { Link } from "react-router-dom"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import UserProfileDialog from "./UserProfileDialog"

interface HeaderProps {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ expanded, setExpanded }) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const [_, setIsScrolled] = useState(false)

  // Handle scroll effect
  useState(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })

  return (
    <header
      className={"fixed top-0 left-0 right-0 z-30 transition-all duration-300 "}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden rounded-full p-2 text-white hover:bg-white/10 transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400 ml-0">
              PicTune
            </span>
          </Link>
        </div>

        {/* User Profile or Sign In */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <UserProfileDialog />
          ) : (
            <Link
              to="/signin"
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white py-2 px-4 rounded-full transition-colors"
            >
              <User size={18} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
