import { createReducer, on } from "@ngrx/store"
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity"
import type { User } from "../models/user.model"
import * as UserActions from "./user.actions"

export interface UserState extends EntityState<User> {
  selectedUserId: string | null
  loading: boolean
  error: string | null
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>()

export const initialState: UserState = adapter.getInitialState({
  selectedUserId: null,
  loading: false,
  error: null,
})

export const userReducer = createReducer(
  initialState,

  // Load users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUsersSuccess, (state, { users }) =>
    adapter.setAll(users, {
      ...state,
      loading: false,
    }),
  ),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load single user
  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUserSuccess, (state, { user }) =>
    adapter.upsertOne(user, {
      ...state,
      selectedUserId: user.id,
      loading: false,
    }),
  ),

  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create user
  on(UserActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.createUserSuccess, (state, { user }) =>
    adapter.addOne(user, {
      ...state,
      loading: false,
    }),
  ),

  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update user
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.updateUserSuccess, (state, { user }) =>
    adapter.updateOne(
      { id: user.id, changes: user },
      {
        ...state,
        loading: false,
      },
    ),
  ),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete user
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.deleteUserSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
    }),
  ),

  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors()

