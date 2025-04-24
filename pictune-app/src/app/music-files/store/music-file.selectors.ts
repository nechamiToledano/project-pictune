import { createSelector, createFeatureSelector } from "@ngrx/store"
import { type MusicFileState, selectAll, selectEntities } from "./music-file.reducer"

export const selectMusicFileState = createFeatureSelector<MusicFileState>("musicFiles")

export const selectAllMusicFiles = createSelector(selectMusicFileState, selectAll)

export const selectMusicFileEntities = createSelector(selectMusicFileState, selectEntities)

export const selectSelectedMusicFileId = createSelector(
  selectMusicFileState,
  (state: MusicFileState) => state.selectedMusicFileId,
)

export const selectSelectedMusicFile = createSelector(
  selectMusicFileEntities,
  selectSelectedMusicFileId,
  (entities:any, selectedId) => (selectedId ? entities[selectedId] : null),
)

export const selectMusicFileLoading = createSelector(selectMusicFileState, (state: MusicFileState) => state.loading)

export const selectMusicFileError = createSelector(selectMusicFileState, (state: MusicFileState) => state.error)

export const selectMusicFileUrls = createSelector(selectMusicFileState, (state: MusicFileState) => state.musicFileUrls)

export const selectMusicFileUrlById = (id: number) => createSelector(selectMusicFileUrls, (urls) => urls[id])

