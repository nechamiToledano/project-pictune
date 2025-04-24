import { createAction, props } from "@ngrx/store"
import type { User, UpdateUserDto } from "../models/user.model"

// Load users
export const loadUsers = createAction("[User] Load Users")

export const loadUsersSuccess = createAction("[User] Load Users Success", props<{ users: User[] }>())

export const loadUsersFailure = createAction("[User] Load Users Failure", props<{ error: string }>())

// Load single user
export const loadUser = createAction("[User] Load User", props<{ id: string }>())

export const loadUserSuccess = createAction("[User] Load User Success", props<{ user: User }>())

export const loadUserFailure = createAction("[User] Load User Failure", props<{ error: string }>())

// Create user
export const createUser = createAction("[User] Create User", props<{ user: any }>())

export const createUserSuccess = createAction("[User] Create User Success", props<{ user: User }>())

export const createUserFailure = createAction("[User] Create User Failure", props<{ error: string }>())

// Update user
export const updateUser = createAction("[User] Update User", props<{ id: string; user: UpdateUserDto }>())

export const updateUserSuccess = createAction("[User] Update User Success", props<{ user: User }>())

export const updateUserFailure = createAction("[User] Update User Failure", props<{ error: string }>())

// Delete user
export const deleteUser = createAction("[User] Delete User", props<{ id: string }>())

export const deleteUserSuccess = createAction("[User] Delete User Success", props<{ id: string }>())

export const deleteUserFailure = createAction("[User] Delete User Failure", props<{ error: string }>())

