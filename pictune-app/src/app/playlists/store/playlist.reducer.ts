import { createReducer, on } from "@ngrx/store"
import { type EntityState, type EntityAdapter, createEntityAdapter } from "@ngrx/entity"
import * as PlaylistActions from "./playlist.actions"
import { Playlist } from "../models/playlist/playlist.model"

export interface PlaylistState extends EntityState<Playlist> {
  selectedPlaylistId: number | null
  loading: boolean
  error: string | null
}

export const adapter: EntityAdapter<Playlist> = createEntityAdapter<Playlist>()

export const initialState: PlaylistState = adapter.getInitialState({
  selectedPlaylistId: null,
  loading: false,
  error: null,
})

export const playlistReducer = createReducer(
  initialState,

  // Load playlists
  on(PlaylistActions.loadPlaylists, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PlaylistActions.loadPlaylistsSuccess, (state, { playlists }) =>
    adapter.setAll(playlists, {
      ...state,
      loading: false,
    }),
  ),

  on(PlaylistActions.loadPlaylistsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load single playlist
  on(PlaylistActions.loadPlaylist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PlaylistActions.loadPlaylistSuccess, (state, { playlist }) =>
    adapter.upsertOne(playlist, {
      ...state,
      selectedPlaylistId: playlist.id,
      loading: false,
    }),
  ),

  on(PlaylistActions.loadPlaylistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create playlist
  on(PlaylistActions.createPlaylist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PlaylistActions.createPlaylistSuccess, (state, { playlist }) =>
    adapter.addOne(playlist, {
      ...state,
      loading: false,
    }),
  ),

  on(PlaylistActions.createPlaylistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update playlist
  on(PlaylistActions.updatePlaylist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PlaylistActions.updatePlaylistSuccess, (state, { playlist }) =>
    adapter.updateOne(
      { id: playlist.id, changes: playlist },
      {
        ...state,
        loading: false,
      },
    ),
  ),

  on(PlaylistActions.updatePlaylistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete playlist
  on(PlaylistActions.deletePlaylist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PlaylistActions.deletePlaylistSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
    }),
  ),

  on(PlaylistActions.deletePlaylistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors()

