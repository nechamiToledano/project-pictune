import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, mergeMap, switchMap, tap } from "rxjs/operators"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { ApiService } from "../../core/services/api.service"
import * as MusicFileActions from "./music-file.actions"
import type { HttpErrorResponse } from "@angular/common/http"
import type { MusicFile } from "../models/music-file.model"

@Injectable()
export class MusicFileEffects {
  private actions$ = inject(Actions)
  private apiService = inject(ApiService)
  private snackBar = inject(MatSnackBar)
  private router = inject(Router)

  loadMusicFiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MusicFileActions.loadMusicFiles),
       tap(() => console.log("[Effect] loadFiles triggered")),
      
      switchMap((action) =>
        this.apiService.getMusicFiles(action.owner, action.favorites).pipe(
          map((musicFiles: MusicFile[]) => MusicFileActions.loadMusicFilesSuccess({ musicFiles })),
          catchError((error: HttpErrorResponse) =>
            of(
              MusicFileActions.loadMusicFilesFailure({
                error: error.error?.message || "Failed to load music files",
              }),
            ),
          ),
        ),
      ),
    )
  })

  loadMusicFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MusicFileActions.loadMusicFile),
      mergeMap((action) =>
        this.apiService.getMusicFile(action.id).pipe(
          map((musicFile) => MusicFileActions.loadMusicFileSuccess({ musicFile })),
          catchError((error) =>
            of(
              MusicFileActions.loadMusicFileFailure({
                error: error.error?.message || "Failed to load music file",
              }),
            ),
          ),
        ),
      ),
    )
  })

  updateMusicFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MusicFileActions.updateMusicFile),
      mergeMap((action) =>
        this.apiService.updateMusicFile(action.id, action.musicFile as MusicFile).pipe(
          map(() => {
            this.snackBar.open("Music file updated successfully", "Close", { duration: 3000 })
            this.router.navigate(["/music-files"])
            return MusicFileActions.loadMusicFiles({})
          }),
          catchError((error) => {
            this.snackBar.open(error.error?.message || "Failed to update music file", "Close", { duration: 3000 })
            return of(
              MusicFileActions.updateMusicFileFailure({
                error: error.error?.message || "Failed to update music file",
              }),
            )
          }),
        ),
      ),
    )
  })

  deleteMusicFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MusicFileActions.deleteMusicFile),
      mergeMap((action) =>
        this.apiService.deleteMusicFile(action.id).pipe(
          map(() => {
            this.snackBar.open("Music file deleted successfully", "Close", { duration: 3000 })
            return MusicFileActions.deleteMusicFileSuccess({ id: action.id })
          }),
          catchError((error) => {
            this.snackBar.open(error.error?.message || "Failed to delete music file", "Close", { duration: 3000 })
            return of(
              MusicFileActions.deleteMusicFileFailure({
                error: error.error?.message || "Failed to delete music file",
              }),
            )
          }),
        ),
      ),
    )
  })

  toggleLike$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MusicFileActions.toggleLike),
      mergeMap((action) =>
        this.apiService.toggleLike(action.id).pipe(
          map(() => MusicFileActions.toggleLikeSuccess({ id: action.id })),
          catchError((error) =>
            of(
              MusicFileActions.toggleLikeFailure({
                error: error.error?.message || "Failed to toggle like",
              }),
            ),
          ),
        ),
      ),
    )
  })

  getMusicFileUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MusicFileActions.getMusicFileUrl),
      mergeMap((action) =>
        this.apiService.getMusicFileUrl(action.id).pipe(
          map((response: { url: string }) =>
            MusicFileActions.getMusicFileUrlSuccess({
              id: action.id,
              url: response.url,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              MusicFileActions.getMusicFileUrlFailure({
                error: error.error?.message || "Failed to get music file URL",
              }),
            ),
          ),
        ),
      ),
    )
  })
}
