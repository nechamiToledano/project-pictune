import { createSelector, createFeatureSelector } from "@ngrx/store"
import { type PlaylistState, selectAll, selectEntities } from "./playlist.reducer"

export const selectPlaylistState = createFeatureSelector<PlaylistState>("playlists")

export const selectAllPlaylists = createSelector(selectPlaylistState, selectAll)

export const selectPlaylistEntities = createSelector(selectPlaylistState, selectEntities)

export const selectSelectedPlaylistId = createSelector(
  selectPlaylistState,
  (state: PlaylistState) => state.selectedPlaylistId,
)

export const selectSelectedPlaylist = createSelector(
  selectPlaylistEntities,
  selectSelectedPlaylistId,
  (entities:any, selectedId) => (selectedId ? entities[selectedId] : null),
)

export const selectPlaylistLoading = createSelector(selectPlaylistState, (state: PlaylistState) => state.loading)

export const selectPlaylistError = createSelector(selectPlaylistState, (state: PlaylistState) => state.error)

