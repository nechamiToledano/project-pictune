import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { ApiService } from "../../core/services/api.service";
import * as AuthActions from "./auth.actions";
import { MatSnackBar } from "@angular/material/snack-bar";
import type { HttpErrorResponse } from "@angular/common/http";
import type { LoginResponse, User } from "../models/user.model";

@Injectable()
export class AuthEffects {
  init$: any;
  login$: any;
  loginSuccess$: any;
  autoLogin$: any;
  loadUserProfile$: any;
  logout$: any;
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.init$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        map(() => {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
          return token && user ? AuthActions.autoLogin() : AuthActions.logout();
        })
      )
    );
  

  this.login$ =  createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.apiService.login(action.request.userName, action.request.password).pipe(
          map((response: LoginResponse) => {
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);
            return AuthActions.loginSuccess({ response });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AuthActions.loginFailure({
              error: error.error?.message || "Login failed"
            }))
          )
        )
      )
    )
  );

 this. loginSuccess$ =createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(() => {
      const userJson = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userJson ? JSON.parse(userJson) : null;

      // Check if user is an admin, else logout
      if (!user?.roles?.includes('Admin')) {
        this.snackBar.open('Access denied: Admins only', 'Close', { duration: 3000 });
       typeof window!=='undefined'? localStorage.removeItem('token'):null;
       typeof window!=='undefined'? localStorage.removeItem('user'):null;
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/']);
      }
    })
  ),
  { dispatch: false }
);


  this.autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      switchMap(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')!!) : null;

        if (!token || !user || !user.roles?.includes('Admin')) {
          return of(AuthActions.logout());
        }

        return of(AuthActions.loginSuccess({
          response: { token, user }
        }));
      }),
      catchError(() => of(AuthActions.logout()))
    )
  );

  

 this. logout$=createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      typeof window !== 'undefined' ? localStorage.removeItem('token') : null;
      typeof window !== 'undefined' ? localStorage.removeItem('user') : null;
      this.router.navigate(['/login']);
    })
  ),
  { dispatch: false }
);}}