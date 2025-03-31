import { createReducer, on } from "@ngrx/store"
import type { File } from "./file.model"
import * as FileActions from "./file.actions"

export interface FileState {
  files: File[]
  error: string | null
}

const initialState: FileState = {
  files: [],
  error: null,
}

export const fileReducer = createReducer(
  initialState,
  on(FileActions.loadFilesSuccess, (state, { files }) => ({
    ...state,
    files,
    error: null,
  })),
  on(FileActions.loadFilesFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(FileActions.addFileSuccess, (state, { file }) => ({
    ...state,
    files: [...state.files, file],
  })),
  on(FileActions.deleteFileSuccess, (state, { fileId }) => ({
    ...state,
    files: state.files.filter((file) => file.id !== fileId),
  })),
)

