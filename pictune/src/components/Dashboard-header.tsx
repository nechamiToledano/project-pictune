"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Music, User, Home, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom"; // ✅ Corrected import
import UserProfileDialog from "./layout/UserProfileDialog";

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

export default function DashboardHeader({
  notificationCount = 3,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(notificationCount);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true for demo

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    }, []);
  



  return (
    <header className="border-b border-gray-900 bg-black 
    backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 flex items-center justify-center">
                <Music className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">PicTune</span>
            </a>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 ml-6">
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-md transition-colors",
                  location.pathname === "/" ? "bg-white/10 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
                )}
                onClick={() => navigate("/")}
              >
                <Home size={18} />
                <span>Home</span>
              </Button>

              {isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-md transition-colors",
                        location.pathname.includes("/music") ||
                          location.pathname.includes("/my-music") ||
                          location.pathname.includes("/favorites")
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <Music size={18} />
                      <span>Music</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-800 text-white">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/music")}>
                        All Music
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/my-music")}>
                        My Music
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/favorites")}>
                        Favorites
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={() => navigate("/upload")}>
                      Upload New
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {!isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md">
                      <User size={18} />
                      <span>Account</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-800 text-white">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/signin")}>Sign In</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/signup")}>Sign Up</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-400 hover:text-white"
              onClick={() => setNotifications(0)}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500 text-[10px] flex items-center justify-center text-white">
                  {notifications}
                </span>
              )}
            </Button>

            <UserProfileDialog            />
          </div>
        </div>
      </div>
    </header>
  );
}
