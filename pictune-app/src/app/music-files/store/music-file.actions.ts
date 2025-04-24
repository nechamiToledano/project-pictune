import { createAction, props } from "@ngrx/store"
import type { MusicFile, MusicFileUploadDto } from "../models/music-file.model"

// Load music files
export const loadMusicFiles = createAction(
  "[MusicFile] Load Music Files",
  props<{ owner?: boolean; favorites?: boolean }>(),
)

export const loadMusicFilesSuccess = createAction(
  "[MusicFile] Load Music Files Success",
  props<{ musicFiles: MusicFile[] }>(),
)

export const loadMusicFilesFailure = createAction("[MusicFile] Load Music Files Failure", props<{ error: string }>())

// Load single music file
export const loadMusicFile = createAction("[MusicFile] Load Music File", props<{ id: number }>())

export const loadMusicFileSuccess = createAction(
  "[MusicFile] Load Music File Success",
  props<{ musicFile: MusicFile }>(),
)

export const loadMusicFileFailure = createAction("[MusicFile] Load Music File Failure", props<{ error: string }>())

// Update music file
export const updateMusicFile = createAction(
  "[MusicFile] Update Music File",
  props<{ id: number; musicFile: MusicFileUploadDto }>(),
)

export const updateMusicFileSuccess = createAction(
  "[MusicFile] Update Music File Success",
  props<{ musicFile: MusicFile }>(),
)

export const updateMusicFileFailure = createAction("[MusicFile] Update Music File Failure", props<{ error: string }>())

// Delete music file
export const deleteMusicFile = createAction("[MusicFile] Delete Music File", props<{ id: number }>())

export const deleteMusicFileSuccess = createAction("[MusicFile] Delete Music File Success", props<{ id: number }>())

export const deleteMusicFileFailure = createAction("[MusicFile] Delete Music File Failure", props<{ error: string }>())

// Toggle like
export const toggleLike = createAction("[MusicFile] Toggle Like", props<{ id: number }>())

export const toggleLikeSuccess = createAction("[MusicFile] Toggle Like Success", props<{ id: number }>())

export const toggleLikeFailure = createAction("[MusicFile] Toggle Like Failure", props<{ error: string }>())

// Get music file URL
export const getMusicFileUrl = createAction("[MusicFile] Get Music File URL", props<{ id: number }>())

export const getMusicFileUrlSuccess = createAction(
  "[MusicFile] Get Music File URL Success",
  props<{ id: number; url: string }>(),
)

export const getMusicFileUrlFailure = createAction("[MusicFile] Get Music File URL Failure", props<{ error: string }>())

