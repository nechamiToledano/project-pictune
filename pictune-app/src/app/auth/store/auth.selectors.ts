import { createSelector } from "@ngrx/store"
import type { AuthState } from "./auth.reducer"

export const selectAuthState = (state: { auth: AuthState }) => state.auth

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state?.user || null
)

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state?.token || null
)

export const selectRoles = createSelector(
  selectAuthState,
  (state: AuthState) => state?.roles || []
)

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => !!state?.isAuthenticated
)

export const selectIsAdmin = createSelector(
  selectRoles,
  (roles: string[]) => roles.includes("Admin")
)

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => !!state?.loading
)

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state?.error || null
)
