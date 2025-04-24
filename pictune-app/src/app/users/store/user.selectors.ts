import { createSelector, createFeatureSelector } from "@ngrx/store"
import { type UserState, selectAll, selectEntities } from "./user.reducer"

export const selectUserState = createFeatureSelector<UserState>("users")

export const selectAllUsers = createSelector(selectUserState, selectAll)

export const selectUserEntities = createSelector(selectUserState, selectEntities)

export const selectSelectedUserId = createSelector(selectUserState, (state: UserState) => state.selectedUserId)

export const selectSelectedUser = createSelector(selectUserEntities, selectSelectedUserId, (entities:any, selectedId) =>
  selectedId ? entities[selectedId] : null,
)

export const selectUserLoading = createSelector(selectUserState, (state: UserState) => state.loading)

export const selectUserError = createSelector(selectUserState, (state: UserState) => state.error)

