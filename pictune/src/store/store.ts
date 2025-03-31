import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import musicFilesReducer from "./slices/musicFilesSlice";
import playlistsReducer from "./slices/playlistsSlice";
import folderReducer from "./slices/folderSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    musicFiles:musicFilesReducer,
    playlists: playlistsReducer,
    folders: folderReducer

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
