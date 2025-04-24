import { Injectable, inject } from "@angular/core"
import { Router } from "@angular/router"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, switchMap, tap } from "rxjs/operators"
import { ApiService } from "../../core/services/api.service"
import * as AuthActions from "./auth.actions"
import type { HttpErrorResponse } from "@angular/common/http"
import type { LoginResponse, User } from "../models/user.model"
import { ROOT_EFFECTS_INIT } from "@ngrx/effects"
import { MatSnackBar } from "@angular/material/snack-bar"
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
    private snackBar: MatSnackBar // הוספת snackBar

  ) {
    this.init$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        map(() => {
          const token = typeof window!=='undefined'?localStorage.getItem('token'):null;
          return token ? AuthActions.autoLogin() : AuthActions.logout();
        })
      )
    );

    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap((action) =>
          this.apiService.login(action.request.userName, action.request.password).pipe(
            map((response: LoginResponse) => {
              console.log(response.roles);//Array(2) "Editor","Viewer"
              length
              : 
              2
              // Store the token only, no user data is included in the response
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
    
    
    this.loginSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        switchMap(() =>
          this.apiService.getUserProfile().pipe(
            tap((user: User) => {
              console.log(user.roles);//array(0)

              if (!user.roles?.includes('admin')) {
                
                this.snackBar.open('Access denied: Admins only', 'Close', { duration: 3000 });
                this.router.navigate(['/login']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            }),
            map(user => AuthActions.loadUserProfileSuccess({ user })),
            catchError(() => of(AuthActions.logout()))
          )
        )
      )
    );
    
    

    this.autoLogin$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.autoLogin),
        switchMap(() => {
          const token = typeof window!=='undefined'?localStorage.getItem('token'):null;
          if (!token) {
            return of(AuthActions.logout());
          }
    
          // Fetch user profile after confirming the token
          return this.apiService.getUserProfile().pipe(
            map((user: User) => {
              if (!user.roles?.includes('admin')) {
                return AuthActions.logout();
              }
              return AuthActions.loginSuccess({
                response: {
                  token,
                  user,
                 roles:user.roles
                }
              });
            }),
            catchError(() => of(AuthActions.logout()))
          );
        })
      )
    );
    
    

    

    this.loadUserProfile$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loadUserProfile),
        switchMap(() =>
          this.apiService.getUserProfile().pipe(
            map((user: User) => AuthActions.loadUserProfileSuccess({ user })),
            catchError((error: HttpErrorResponse) =>
              of(AuthActions.loadUserProfileFailure({
                error: error.error?.message || "Failed to load user profile"
              }))
            )
          )
        )
      )
    );

    this.logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          typeof window!=='undefined'?localStorage.removeItem('token'):null;
          this.router.navigate(["/login"]);
        })
      ), { dispatch: false }
    );
  }
}
