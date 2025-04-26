import { createAction, props } from "@ngrx/store"
import type { User, LoginRequest, LoginResponse } from "../models/user.model"

// Login actions
export const login = createAction("[Auth] Login", props<{ request: LoginRequest }>())

export const loginSuccess = createAction("[Auth] Login Success", props<{ response: LoginResponse }>())

export const loginFailure = createAction("[Auth] Login Failure", props<{ error: string }>())

// Auto login action (when app starts and token exists)
export const autoLogin = createAction("[Auth] Auto Login")

// Logout action
export const logout = createAction("[Auth] Logout")

// Get user profile actions

export const loadUserProfileSuccess = createAction("[Auth] Load User Profile Success", props<{ user: User }>())

export const loadUserProfileFailure = createAction("[Auth] Load User Profile Failure", props<{ error: string }>())

