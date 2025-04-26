import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { ApiService } from "../../core/services/api.service";
import * as UserActions from "./user.actions";
import type { HttpErrorResponse } from "@angular/common/http";
import type { User } from "../models/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class UserEffects {
  loadUsers$: any;
  loadUser$: any;
  createUser$: any;
  createUserSuccess$: any;
  updateUser$: any;
  updateUserSuccess$: any;
  deleteUser$: any;
  deleteUserSuccess$: any;

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loadUsers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadUsers),
        tap(() => console.log("[Effect] loadUsers triggered")),
        mergeMap(() =>
          this.apiService.getUsers().pipe(
            map((users: User[]) => {
              console.log("[Effect] loadUsers success", users);
              return UserActions.loadUsersSuccess({ users });
            }),
            catchError((error: HttpErrorResponse) => {
              console.error("[Effect] loadUsers error", error);
              return of(
                UserActions.loadUsersFailure({
                  error: error.error?.message || "Failed to load users",
                })
              );
            })
          )
        )
      )
    );

    this.loadUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.loadUser),
        tap(() => console.log("[Effect] loadUser triggered")),
        mergeMap((action) =>
          this.apiService.getUserProfile(action.id).pipe(
            map((user: User) => {
              console.log("[Effect] loadUser success", user);
              return UserActions.loadUserSuccess({ user });
            }),
            catchError((error: HttpErrorResponse) => {
              console.error("[Effect] loadUser error", error);
              return of(
                UserActions.loadUserFailure({
                  error: error.error?.message || "Failed to load user",
                })
              );
            })
          )
        )
      )
    );

    this.createUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createUser),
        tap((action) => console.log("[Effect] createUser triggered", action)),
        mergeMap((action) =>
          this.apiService.createUser(action.user).pipe(
            map(() => {
              console.log("[Effect] createUser success", action.user);
              return UserActions.createUserSuccess({ user: action.user });
            }),
            catchError((error: HttpErrorResponse) => {
              console.error("[Effect] createUser error", error);
              return of(
                UserActions.createUserFailure({
                  error: error.error?.message || "Failed to create user",
                })
              );
            })
          )
        )
      )
    );

    this.createUserSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(UserActions.createUserSuccess),
          tap(() => {
            console.log("[Effect] createUserSuccess");
            this.snackBar.open("User created successfully", "Close", { duration: 3000 });
            this.router.navigate(["/users"]);
          })
        ),
      { dispatch: false }
    );

    this.updateUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.updateUser),
        tap((action) => console.log("[Effect] updateUser triggered", action)),
        mergeMap((action) =>
          this.apiService.updateUser(action.id, action.user).pipe(
            map((updatedUser: User) => {
              console.log("[Effect] updateUser success", updatedUser);
              return UserActions.updateUserSuccess({ user: updatedUser });
            }),
            catchError((error: HttpErrorResponse) => {
              console.error("[Effect] updateUser error", error);
              return of(
                UserActions.updateUserFailure({
                  error: error.error?.message || "Failed to update user",
                })
              );
            })
          )
        )
      )
    );

    this.updateUserSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(UserActions.updateUserSuccess),
          tap(() => {
            console.log("[Effect] updateUserSuccess");
            this.snackBar.open("User updated successfully", "Close", { duration: 3000 });
            this.router.navigate(["/users"]);
          })
        ),
      { dispatch: false }
    );

    this.deleteUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.deleteUser),
        tap((action) => console.log("[Effect] deleteUser triggered", action)),
        mergeMap((action) =>
          this.apiService.deleteUser(action.id).pipe(
            map(() => {
              console.log("[Effect] deleteUser success", action.id);
              return UserActions.deleteUserSuccess({ id: action.id });
            }),
            catchError((error: HttpErrorResponse) => {
              console.error("[Effect] deleteUser error", error);
              return of(
                UserActions.deleteUserFailure({
                  error: error.error?.message || "Failed to delete user",
                })
              );
            })
          )
        )
      )
    );

    this.deleteUserSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(UserActions.deleteUserSuccess),
          tap(() => {
            console.log("[Effect] deleteUserSuccess");
            this.snackBar.open("User deleted successfully", "Close", { duration: 3000 });
          })
        ),
      { dispatch: false }
    );
  }
}
