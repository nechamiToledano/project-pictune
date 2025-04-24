import { createAction, props } from "@ngrx/store"
import { Playlist, CreatePlaylistDto, UpdatePlaylistDto } from "../models/playlist/playlist.model"

// Load playlists
export const loadPlaylists = createAction("[Playlist] Load Playlists")

export const loadPlaylistsSuccess = createAction(
  "[Playlist] Load Playlists Success",
  props<{ playlists: Playlist[] }>(),
)

export const loadPlaylistsFailure = createAction("[Playlist] Load Playlists Failure", props<{ error: string }>())

// Load single playlist
export const loadPlaylist = createAction("[Playlist] Load Playlist", props<{ id: number }>())

export const loadPlaylistSuccess = createAction("[Playlist] Load Playlist Success", props<{ playlist: Playlist }>())

export const loadPlaylistFailure = createAction("[Playlist] Load Playlist Failure", props<{ error: string }>())

// Create playlist
export const createPlaylist = createAction("[Playlist] Create Playlist", props<{ playlist: CreatePlaylistDto }>())

export const createPlaylistSuccess = createAction("[Playlist] Create Playlist Success", props<{ playlist: Playlist }>())

export const createPlaylistFailure = createAction("[Playlist] Create Playlist Failure", props<{ error: string }>())

// Update playlist
export const updatePlaylist = createAction(
  "[Playlist] Update Playlist",
  props<{ id: number; playlist: UpdatePlaylistDto }>(),
)

export const updatePlaylistSuccess = createAction("[Playlist] Update Playlist Success", props<{ playlist: Playlist }>())

export const updatePlaylistFailure = createAction("[Playlist] Update Playlist Failure", props<{ error: string }>())

// Delete playlist
export const deletePlaylist = createAction("[Playlist] Delete Playlist", props<{ id: number }>())

export const deletePlaylistSuccess = createAction("[Playlist] Delete Playlist Success", props<{ id: number }>())

export const deletePlaylistFailure = createAction("[Playlist] Delete Playlist Failure", props<{ error: string }>())

// Add music file to playlist
export const addToPlaylist = createAction(
  "[Playlist] Add To Playlist",
  props<{ playlistId: number; musicFileId: number }>(),
)

export const addToPlaylistSuccess = createAction(
  "[Playlist] Add To Playlist Success",
  props<{ playlistId: number; musicFileId: number }>(),
)

export const addToPlaylistFailure = createAction("[Playlist] Add To Playlist Failure", props<{ error: string }>())

// Remove music file from playlist
export const removeFromPlaylist = createAction(
  "[Playlist] Remove From Playlist",
  props<{ playlistId: number; musicFileId: number }>(),
)

export const removeFromPlaylistSuccess = createAction(
  "[Playlist] Remove From Playlist Success",
  props<{ playlistId: number; musicFileId: number }>(),
)

export const removeFromPlaylistFailure = createAction(
  "[Playlist] Remove From Playlist Failure",
  props<{ error: string }>(),
)

