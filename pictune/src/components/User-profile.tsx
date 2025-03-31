"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Camera,
  Save,
  Edit,
  Music,
  Upload,
  Calendar,
  Heart,
  PlayCircle,
  BarChart3,
  Share2,
  LinkIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

interface UserStats {
  uploads: number
  favorites: number
  followers: number
  following: number
  plays: number
}

interface UserActivity {
  date: string
  action: string
  item: string
}

interface EnhancedUserProfileProps {
  userName?: string
  userEmail?: string
  userImage?: string
  userBio?: string
  userLocation?: string
  userWebsite?: string
  userJoinDate?: string
  userStats?: UserStats
  userActivity?: UserActivity[]
  userFavorites?: { id: string; title: string; artist: string }[]
}

export default function UserProfile({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userImage = "/placeholder.svg?height=96&width=96",
  userBio = "Music enthusiast and creator. I love exploring new sounds and creating unique audio experiences.",
  userLocation = "New York, USA",
  userWebsite = "https://johndoe.com",
  userJoinDate = "January 2023",
  userStats = {
    uploads: 12,
    favorites: 48,
    followers: 156,
    following: 89,
    plays: 1243,
  },
  userActivity = [
    { date: "Today", action: "Uploaded", item: "New Song" },
    { date: "Yesterday", action: "Liked", item: "Summer Vibes" },
    { date: "3 days ago", action: "Followed", item: "Artist Five" },
    { date: "1 week ago", action: "Commented on", item: "Chill Beats" },
    { date: "2 weeks ago", action: "Shared", item: "Ambient Sounds" },
  ],
  userFavorites = [
    { id: "1", title: "First Song", artist: "Artist One" },
    { id: "2", title: "Second Song", artist: "Artist Two" },
    { id: "3", title: "Third Song", artist: "Artist Three" },
  ],
}: EnhancedUserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    bio: userBio,
    location: userLocation,
    website: userWebsite,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // In a real app, you would save the data to the server here
    setIsEditing(false)
  }

  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 p-2 rounded-full">
          <User className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1 bg-black/40 backdrop-blur-md border-gray-800 text-white overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
          <CardHeader className="relative pb-0">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-black/40 shadow-xl">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="bg-gradient-to-r from-red-600/20 to-blue-600/20 text-white text-2xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-4 text-xl">{formData.name}</CardTitle>
              <CardDescription className="text-gray-400">{formData.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              <div className="bg-black/30 rounded-lg p-2">
                <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                  {userStats.uploads}
                </p>
                <p className="text-xs text-gray-400">Uploads</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                  {userStats.followers}
                </p>
                <p className="text-xs text-gray-400">Followers</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                  {userStats.plays}
                </p>
                <p className="text-xs text-gray-400">Plays</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Joined {userJoinDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Upload className="h-4 w-4 text-gray-400" />
                <span>{userStats.uploads} uploads</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Heart className="h-4 w-4 text-gray-400" />
                <span>{userStats.favorites} favorite songs</span>
              </div>
              {formData.location && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{formData.location}</span>
                </div>
              )}
              {formData.website && (
                <div className="flex items-center gap-3 text-sm">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {formData.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400 italic">"{formData.bio}"</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsEditing(true)} className="w-full bg-white/10 hover:bg-white/20 text-white">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2 bg-black/40 backdrop-blur-md border-gray-800 text-white overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription className="text-gray-400">
              {isEditing ? "Edit your profile information below" : "View and manage your profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-black/60 border border-gray-800 p-1 rounded-lg mb-6">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20 rounded-md border-transparent data-[state=active]:border-gradient-to-r data-[state=active]:text-white transition-all text-gray-400"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20 rounded-md border-transparent data-[state=active]:border-gradient-to-r data-[state=active]:text-white transition-all text-gray-400"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20 rounded-md border-transparent data-[state=active]:border-gradient-to-r data-[state=active]:text-white transition-all text-gray-400"
                >
                  Favorites
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-blue-600/20 rounded-md border-transparent data-[state=active]:border-gradient-to-r data-[state=active]:text-white transition-all text-gray-400"
                >
                  Stats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2 text-white">
                        <User className="h-4 w-4" />
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-black/30 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-white">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-black/30 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-blue-400"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio" className="flex items-center gap-2 text-white">
                        <User className="h-4 w-4" />
                        Bio
                      </Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md bg-black/30 border border-gray-700 text-white placeholder:text-gray-400 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2 text-white">
                        <User className="h-4 w-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="bg-black/30 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2 text-white">
                        <LinkIcon className="h-4 w-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="bg-black/30 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-blue-400"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-700 text-white hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-400">Recent Uploads</h3>
                        <div className="space-y-3">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                              <div className="h-10 w-10 rounded-md bg-gradient-to-r from-red-600/20 to-blue-600/20 flex items-center justify-center">
                                <Music className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">Song Title {item}</p>
                                <p className="text-xs text-gray-400">Uploaded 2 days ago</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-gray-400 hover:text-white"
                              >
                                <PlayCircle className="h-5 w-5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-400">Followers</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="flex flex-col items-center">
                              <Avatar className="h-12 w-12 mb-1">
                                <AvatarImage
                                  src={`/placeholder.svg?height=48&width=48&text=U${item}`}
                                  alt={`User ${item}`}
                                />
                                <AvatarFallback className="bg-gradient-to-r from-red-600/20 to-blue-600/20 text-white">
                                  U{item}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-xs text-center truncate w-full">User {item}</p>
                            </div>
                          ))}
                        </div>
                        <Button variant="ghost" className="w-full text-sm text-blue-400 hover:text-blue-300 mt-2">
                          View All Followers
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-400">About Me</h3>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm">{formData.bio}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-4">
                  {userActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-black/30 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                        {activity.action === "Uploaded" && <Upload className="h-5 w-5 text-white" />}
                        {activity.action === "Liked" && <Heart className="h-5 w-5 text-white" />}
                        {activity.action === "Followed" && <User className="h-5 w-5 text-white" />}
                        {activity.action === "Commented on" && <MessageCircle className="h-5 w-5 text-white" />}
                        {activity.action === "Shared" && <Share2 className="h-5 w-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{activity.action}</span>{" "}
                              <span className="text-blue-400">{activity.item}</span>
                            </p>
                            <p className="text-xs text-gray-400">{activity.date}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                  View More Activity
                </Button>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userFavorites.map((song) => (
                    <div key={song.id} className="flex items-center gap-3 p-4 bg-black/30 rounded-lg">
                      <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={`/placeholder.svg?height=48&width=48&text=🎵`}
                          alt={song.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{song.title}</p>
                        <p className="text-xs text-gray-400">{song.artist}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
                        >
                          <Heart className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/music" >
                  <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                    View All Favorites
                  </Button>
                </Link>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-black/30 rounded-lg text-center">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                      {userStats.uploads}
                    </p>
                    <p className="text-sm text-gray-400">Uploads</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg text-center">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                      {userStats.plays}
                    </p>
                    <p className="text-sm text-gray-400">Total Plays</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg text-center">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                      {userStats.followers}
                    </p>
                    <p className="text-sm text-gray-400">Followers</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg text-center">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                      {userStats.following}
                    </p>
                    <p className="text-sm text-gray-400">Following</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Listening Activity</h3>
                  <div className="p-4 bg-black/30 rounded-lg h-48 flex items-center justify-center">
                    <div className="flex items-end h-32 gap-1">
                      {[35, 65, 45, 80, 55, 70, 40, 60, 50, 75, 30, 85].map((height, index) => (
                        <div
                          key={index}
                          className="w-6 bg-gradient-to-t from-red-600 to-blue-600 rounded-t-sm"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Detailed Analytics
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          {isEditing && (
            <CardFooter className="flex justify-end gap-4 border-t border-gray-800 pt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

function MessageCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}

