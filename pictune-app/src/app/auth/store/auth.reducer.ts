import { createReducer, on } from "@ngrx/store"
import type { User } from "../models/user.model"
import * as AuthActions from "./auth.actions"

export interface AuthState {
  user: User | null
  token: string | null
  roles: string[]
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const initialState: AuthState = {
  user: null,
  token: null,
  roles: [],
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    token: response.token,
    user: response.user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),



  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    token: null,
    roles: [],
    isAuthenticated: false,
    error: null,
  })),



  on(AuthActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),

  on(AuthActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

