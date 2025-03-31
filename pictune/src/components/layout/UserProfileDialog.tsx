"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Camera, Music, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { fetchUserProfile } from "@/store/slices/userSlice"
import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"

export default function UserProfileDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user) // Fetch user from store
  const [_, setLoading] = useState(true) // Track loading state of user profile

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(fetchUserProfile()).unwrap()
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    if (isLoggedIn) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [dispatch, isLoggedIn])

  const handleLogout = () => {
    // Clear localStorage and reset any necessary state
    localStorage.removeItem("token")
    dispatch({ type: "user/logout" }) // Replace with actual action if needed
    navigate("/")
    setOpen(false)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const userName = user?.userName || "User"
  const userEmail = user?.email || "email@example.com"
  const userImage =  "" 

  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-12 w-12 border border-gray-800">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-gradient-to-r from-red-600/20 to-blue-600/20 text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black/90 backdrop-blur-md text-white border-gray-800 shadow-xl">
        <div className="h-1 w-full bg-gradient-to-r from-red-600/20 to-blue-600/20 -mt-6 mb-4 mx-auto"></div>
        <DialogHeader>
          <DialogTitle className="text-xl">User Profile</DialogTitle>
          <DialogDescription className="text-gray-400">Manage your account settings and preferences</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <div className="relative group">
            <Avatar className="h-24 w-24 mb-4 border-4 border-black/40 shadow-xl">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-gradient-to-r from-red-600/20 to-blue-600/20 text-white text-2xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-3 right-0 rounded-full bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-lg font-medium">{userName}</h3>
          <p className="text-sm text-gray-400">{userEmail}</p>
        </div>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start text-white border-gray-700 hover:bg-gray-800 py-5"
            onClick={() => handleNavigation("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-white border-gray-700 hover:bg-gray-800 py-5"
            onClick={() => handleNavigation("/my-music")}
          >
            <Music className="mr-2 h-4 w-4" />
            My Music
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-white border-gray-700 hover:bg-gray-800 py-5"
            onClick={() => handleNavigation("/upload")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Music
          </Button>
          
          <Button
            className="w-full justify-start bg-gradient-to-r from-red-900/80 to-red-800/80 hover:from-red-900 hover:to-red-800 py-5 mt-2"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
