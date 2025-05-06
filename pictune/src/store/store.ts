import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import musicFilesReducer from "./slices/musicFilesSlice";
import playlistsReducer from "./slices/playlistsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    musicFiles:musicFilesReducer,
    playlists: playlistsReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
