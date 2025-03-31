import type React from "react"
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Outlet } from "react-router-dom"
import SongsPage from "./pages/AllMusic"
import SongDetails from "./pages/SongDetails"
import FileUploader from "./pages/FileUploader"
import { Toaster } from "sonner"
import PlaylistDetails from "./pages/PlaylistDetails"
import MusicLibrary from "./pages/MusicLibrary"
import CreatePlaylistPage from "./components/CreatePlaylist"
import ResetPassword from "./pages/ResetPassword"

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Add Toaster component here for toast notifications */}
      <Toaster position="top-center" richColors closeButton />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/music" element={<SongsPage />} />
          <Route path="/music/:id" element={<SongDetails />} />
          <Route path="/upload" element={<FileUploader />} />
          <Route path="/playlists" element={<MusicLibrary />} />
          <Route path="/playlists/:id" element={<PlaylistDetails />} />    
          <Route path="/create-playlist" element={<CreatePlaylistPage />} />    
          <Route path="/reset-password" element={<ResetPassword />} />

              </Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App

