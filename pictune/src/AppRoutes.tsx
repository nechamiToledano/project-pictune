import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SongsPage from "./pages/AllMusic";
import SongDetails from "./pages/SongDetails";
import FileUploader from "./pages/FileUploader";
import PlaylistDetails from "./pages/PlaylistDetails";
import MusicLibrary from "./pages/MusicLibrary";
import CreatePlaylistPage from "./components/CreatePlaylist";
import ResetPassword from "./pages/ResetPassword";
import NotFoundScreen from "./pages/NotFoundScreen";
import GuestRoute from "./guards/GuestRoute";
import ProtectedRoute from "./guards/ProtectedRoute";
import AIPlaylistGenerator from "./pages/AIPlaylistGenerator";
import ClipEditor from "./components/clip-editor/clip-editor";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
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

const AppRoutes: React.FC = () => {
 const isAuthenticated = useSelector((state: RootState) => state.user.isLoggedIn);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/signin" element={
          <GuestRoute isAuthenticated={isAuthenticated}>
            <SignIn />
          </GuestRoute>
        } />
        <Route path="/signup" element={
          <GuestRoute isAuthenticated={isAuthenticated}>
            <SignUp />
          </GuestRoute>
        } />

        <Route path="/music" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SongsPage />
          </ProtectedRoute>
        } />
        <Route path="/music/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SongDetails />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <FileUploader />
          </ProtectedRoute>
        } />
        <Route path="/playlists" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MusicLibrary />
          </ProtectedRoute>
        } />
        <Route path="/playlists/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PlaylistDetails />
          </ProtectedRoute>
        } />
        <Route path="/create-playlist" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreatePlaylistPage />
          </ProtectedRoute>
        } />
        <Route path="/ai-playlist" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AIPlaylistGenerator />
          </ProtectedRoute>
        } />
        <Route path="/song2clip" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ClipEditor />
          </ProtectedRoute>
        } />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;