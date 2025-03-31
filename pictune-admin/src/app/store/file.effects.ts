import { Injectable } from "@angular/core"
import { type Actions, createEffect, ofType } from "@ngrx/effects"
import type { HttpClient } from "@angular/common/http"
import { catchError, map, mergeMap, of } from "rxjs"
import * as FileActions from "./file.actions"
import { SupabaseService } from "../supabase.service"
@Injectable()
export class FileEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private supabaseService: SupabaseService,
  ) {}

  loadFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileActions.loadFiles),
      mergeMap(() =>
        this.supabaseService.getMusicFiles().pipe(
          map((response:any) => {
            // Transform MusicFile to File format
            const files =
              response.data?.map((musicFile: { id: any; file_name: any; file_size: any; file_url: any }) => ({
                id: musicFile.id || "",
                name: musicFile.file_name,
                size: musicFile.file_size,
                type: "audio",
                url: musicFile.file_url,
              })) || []

            return FileActions.loadFilesSuccess({ files })
          }),
          catchError((error) => of(FileActions.loadFilesFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  addFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileActions.addFile),
      mergeMap((action) => {
        // Transform File to MusicFile format
        const musicFile = {
          title: action.file.name.split(".")[0],
          artist: "Unknown",
          file_url: action.file.url,
          file_name: action.file.name,
          file_size: action.file.size,
          user_id: "",
        }

        return this.supabaseService.createMusicFile(musicFile).pipe(
          map((response) => {
            const newFile = {
              id: response.data?.[0]?.id || action.file.id,
              name: action.file.name,
              size: action.file.size,
              type: action.file.type,
              url: action.file.url,
            }
            return FileActions.addFileSuccess({ file: newFile })
          }),
          catchError((error) => of(FileActions.addFileFailure({ error: error.message }))),
        )
      }),
    ),
  )

  deleteFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileActions.deleteFile),
      mergeMap((action) =>
        this.supabaseService.deleteMusicFile(action.fileId).pipe(
          map(() => FileActions.deleteFileSuccess({ fileId: action.fileId })),
          catchError((error) => of(FileActions.deleteFileFailure({ error: error.message }))),
        ),
      ),
    ),
  )
}

