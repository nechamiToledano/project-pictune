import { createReducer, on } from '@ngrx/store';
import { User } from './user.model';
import * as UserActions from './user.actions';

export interface UserState {
  users: User[];
  error: string | null;
}

const initialState: UserState = {
  users: [],
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, error: null })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, error }))
);
