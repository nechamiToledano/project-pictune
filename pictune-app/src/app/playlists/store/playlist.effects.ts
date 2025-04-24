import { Injectable, inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, mergeMap, switchMap } from "rxjs/operators"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { ApiService } from "../../core/services/api.service"
import * as PlaylistActions from "./playlist.actions"
import type { HttpErrorResponse } from "@angular/common/http"
import { Playlist } from "../models/playlist/playlist.model"

@Injectable()
export class PlaylistEffects {
  // Use inject() instead of constructor injection
  private actions$ = inject(Actions)
  private apiService = inject(ApiService)
  private snackBar = inject(MatSnackBar)
  private router = inject(Router)

  loadPlaylists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlaylistActions.loadPlaylists),
      switchMap(() =>
        this.apiService.getPlaylists().pipe(
          map((playlists: Playlist[]) => PlaylistActions.loadPlaylistsSuccess({ playlists })),
          catchError((error: HttpErrorResponse) =>
            of(
              PlaylistActions.loadPlaylistsFailure({
                error: error.error?.message || "Failed to load playlists",
              }),
            ),
          ),
        ),
      ),
    )
  })

  loadPlaylist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlaylistActions.loadPlaylist),
      mergeMap((action) =>
        this.apiService.getPlaylist(action.id).pipe(
          map((playlist: Playlist) => PlaylistActions.loadPlaylistSuccess({ playlist })),
          catchError((error: HttpErrorResponse) =>
            of(
              PlaylistActions.loadPlaylistFailure({
                error: error.error?.message || "Failed to load playlist",
              }),
            ),
          ),
        ),
      ),
    )
  })

  createPlaylist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlaylistActions.createPlaylist),
      mergeMap((action) =>
        this.apiService.createPlaylist(action.playlist).pipe(
          map((playlist) => {
            this.snackBar.open("Playlist created successfully", "Close", { duration: 3000 })
            this.router.navigate(["/playlists"])
            return PlaylistActions.createPlaylistSuccess({ playlist })
          }),
          catchError((error) => {
            this.snackBar.open(error.error?.message || "Failed to create playlist", "Close", { duration: 3000 })
            return of(
              PlaylistActions.createPlaylistFailure({
                error: error.error?.message || "Failed to create playlist",
              }),
            )
          }),
        ),
      ),
    )
  })

  updatePlaylist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlaylistActions.updatePlaylist),
      mergeMap((action) =>
        this.apiService.updatePlaylist(action.id, action.playlist).pipe(
          map((playlist) => {
            this.snackBar.open("Playlist updated successfully", "Close", { duration: 3000 })
            this.router.navigate(["/playlists"])
            return PlaylistActions.updatePlaylistSuccess({ playlist })
          }),
          catchError((error) => {
            this.snackBar.open(error.error?.message || "Failed to update playlist", "Close", { duration: 3000 })
            return of(
              PlaylistActions.updatePlaylistFailure({
                error: error.error?.message || "Failed to update playlist",
              }),
            )
          }),
        ),
      ),
    )
  })

  deletePlaylist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlaylistActions.deletePlaylist),
      mergeMap((action) =>
        this.apiService.deletePlaylist(action.id).pipe(
          map(() => {
            this.snackBar.open("Playlist deleted successfully", "Close", { duration: 3000 })
            return PlaylistActions.deletePlaylistSuccess({ id: action.id })
          }),
          catchError((error) => {
            this.snackBar.open(error.error?.message || "Failed to delete playlist", "Close", { duration: 3000 })
            return of(
              PlaylistActions.deletePlaylistFailure({
                error: error.error?.message || "Failed to delete playlist",
              }),
            )
          }),
        ),
      ),
    )
  })

  addToPlaylist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlaylistActions.addToPlaylist),
      mergeMap((action) =>
        this.apiService.addToPlaylist(action.playlistId, action.musicFileId).pipe(
          map(() => {
            this.snackBar.open("Music file added to playlist", "Close", { duration: 3000 })
            return PlaylistActions.addToPlaylistSuccess({
              playlistId: action.playlistId,
              musicFileId: action.musicFileId,
            })
          }),
          catchError((error) => {
            this.snackBar.open(error.error?.message || "Failed to add music file to playlist", "Close", {
              duration: 3000,
            })
            return of(
              PlaylistActions.addToPlaylistFailure({
                error: error.error?.message || "Failed to add music file to playlist",
              }),
            )
          }),
        ),
      ),
    )
  })

  removeFromPlaylist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlaylistActions.removeFromPlaylist),
      mergeMap((action) =>
        this.apiService.removeFromPlaylist(action.playlistId, action.musicFileId).pipe(
          map(() => {
            this.snackBar.open("Music file removed from playlist", "Close", { duration: 3000 })
            return PlaylistActions.removeFromPlaylistSuccess({
              playlistId: action.playlistId,
              musicFileId: action.musicFileId,
            })
          }),
          catchError((error) => {
            this.snackBar.open(error.error?.message || "Failed to remove music file from playlist", "Close", {
              duration: 3000,
            })
            return of(
              PlaylistActions.removeFromPlaylistFailure({
                error: error.error?.message || "Failed to remove music file from playlist",
              }),
            )
          }),
        ),
      ),
    )
  })
}
