import { createAction, props } from "@ngrx/store"
import type { User } from "./user.model"

export const loadUsers = createAction("[User] Load Users")
export const loadUsersSuccess = createAction("[User] Load Users Success", props<{ users: User[] }>())
export const loadUsersFailure = createAction("[User] Load Users Failure", props<{ error: string }>())

// Add additional actions for user management
export const addUser = createAction("[User] Add User", props<{ user: User }>())
export const addUserSuccess = createAction("[User] Add User Success", props<{ user: User }>())
export const addUserFailure = createAction("[User] Add User Failure", props<{ error: string }>())

export const updateUser = createAction("[User] Update User", props<{ user: User }>())
export const updateUserSuccess = createAction("[User] Update User Success", props<{ user: User }>())
export const updateUserFailure = createAction("[User] Update User Failure", props<{ error: string }>())

export const deleteUser = createAction("[User] Delete User", props<{ userId: string }>())
export const deleteUserSuccess = createAction("[User] Delete User Success", props<{ userId: string }>())
export const deleteUserFailure = createAction("[User] Delete User Failure", props<{ error: string }>())

