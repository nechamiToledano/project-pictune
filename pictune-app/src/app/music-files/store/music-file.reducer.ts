import { createReducer, on } from "@ngrx/store"
import { type EntityState, type EntityAdapter, createEntityAdapter } from "@ngrx/entity"
import type { MusicFile } from "../models/music-file.model"
import * as MusicFileActions from "./music-file.actions"

export interface MusicFileState extends EntityState<MusicFile> {
  selectedMusicFileId: number | null
  loading: boolean
  error: string | null
  musicFileUrls: Record<number, string>
}

export const adapter: EntityAdapter<MusicFile> = createEntityAdapter<MusicFile>()

export const initialState: MusicFileState = adapter.getInitialState({
  selectedMusicFileId: null,
  loading: false,
  error: null,
  musicFileUrls: {},
})

export const musicFileReducer = createReducer(
  initialState,

  // Load music files
  on(MusicFileActions.loadMusicFiles, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(MusicFileActions.loadMusicFilesSuccess, (state, { musicFiles }) =>
    adapter.setAll(musicFiles, {
      ...state,
      loading: false,
    }),
  ),

  on(MusicFileActions.loadMusicFilesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load single music file
  on(MusicFileActions.loadMusicFile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(MusicFileActions.loadMusicFileSuccess, (state, { musicFile }) =>
    adapter.upsertOne(musicFile, {
      ...state,
      selectedMusicFileId: musicFile.id,
      loading: false,
    }),
  ),

  on(MusicFileActions.loadMusicFileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update music file
  on(MusicFileActions.updateMusicFile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(MusicFileActions.updateMusicFileSuccess, (state, { musicFile }) =>
    adapter.updateOne(
      { id: musicFile.id, changes: musicFile },
      {
        ...state,
        loading: false,
      },
    ),
  ),

  on(MusicFileActions.updateMusicFileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete music file
  on(MusicFileActions.deleteMusicFile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(MusicFileActions.deleteMusicFileSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
    }),
  ),

  on(MusicFileActions.deleteMusicFileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Toggle like
  on(MusicFileActions.toggleLike, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(MusicFileActions.toggleLikeSuccess, (state, { id }) => {
    const entity = state.entities[id]
    if (!entity) return state

    return adapter.updateOne(
      {
        id,
        changes: {
          isLiked: !entity.isLiked,
        },
      },
      {
        ...state,
        loading: false,
      },
    )
  }),

  on(MusicFileActions.toggleLikeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get music file URL
  on(MusicFileActions.getMusicFileUrl, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(MusicFileActions.getMusicFileUrlSuccess, (state, { id, url }) => ({
    ...state,
    musicFileUrls: {
      ...state.musicFileUrls,
      [id]: url,
    },
    loading: false,
  })),

  on(MusicFileActions.getMusicFileUrlFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors()

