import { Injectable } from "@angular/core"
import { type Actions, createEffect, ofType } from "@ngrx/effects"
import type { HttpClient } from "@angular/common/http"
import { catchError, map, mergeMap, of } from "rxjs"
import * as UserActions from "./user.actions"
import { SupabaseService } from "../supabase.service"

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private supabaseService: SupabaseService,
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.supabaseService.getUsers().pipe(
          map((response) => {
            // Transform Profile to User format
            const users =
              response.data?.map((profile: { id: any; username: any; email: any }) => ({
                id: profile.id || "",
                name: profile.username,
                email: profile.email,
                role: "user", // Default role
              })) || []

            return UserActions.loadUsersSuccess({ users })
          }),
          catchError((error) => of(UserActions.loadUsersFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      mergeMap((action) => {
        // Transform User to Profile format
        const profile = {
          username: action.user.name,
          email: action.user.email,
        }

        return this.supabaseService.updateUser(profile).pipe(
          map((response) => {
            const newUser = {
              id: response.data?.[0]?.id || action.user.id,
              name: action.user.name,
              email: action.user.email,
              role: action.user.role,
            }
            return UserActions.addUserSuccess({ user: newUser })
          }),
          catchError((error) => of(UserActions.addUserFailure({ error: error.message }))),
        )
      }),
    ),
  )

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap((action) => {
        // Transform User to Profile format
        const profile = {
          id: action.user.id,
          username: action.user.name,
          email: action.user.email,
        }

        return this.supabaseService.updateUser(profile).pipe(
          map(() => UserActions.updateUserSuccess({ user: action.user })),
          catchError((error) => of(UserActions.updateUserFailure({ error: error.message }))),
        )
      }),
    ),
  )

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap((action) =>
        this.supabaseService.deleteUser(action.userId).pipe(
          map(() => UserActions.deleteUserSuccess({ userId: action.userId })),
          catchError((error) => of(UserActions.deleteUserFailure({ error: error.message }))),
        ),
      ),
    ),
  )
}

