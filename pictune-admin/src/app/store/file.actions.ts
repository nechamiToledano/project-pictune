import { createAction, props } from "@ngrx/store"
import type { File } from "./file.model"

export const loadFiles = createAction("[File] Load Files")
export const loadFilesSuccess = createAction("[File] Load Files Success", props<{ files: File[] }>())
export const loadFilesFailure = createAction("[File] Load Files Failure", props<{ error: string }>())

export const addFile = createAction("[File] Add File", props<{ file: File }>())
export const addFileSuccess = createAction("[File] Add File Success", props<{ file: File }>())
export const addFileFailure = createAction("[File] Add File Failure", props<{ error: string }>())

export const deleteFile = createAction("[File] Delete File", props<{ fileId: string }>())
export const deleteFileSuccess = createAction("[File] Delete File Success", props<{ fileId: string }>())
export const deleteFileFailure = createAction("[File] Delete File Failure", props<{ error: string }>())

