import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from '../auth/store/auth.reducer';
import { userReducer } from '../users/store/user.reducer';
import { musicFileReducer } from '../music-files/store/music-file.reducer';
import { playlistReducer } from '../playlists/store/playlist.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  users: userReducer, 
  musicFiles:musicFileReducer,
  playlists:playlistReducer
};

