import api from "@/components/Api";
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { MusicFile } from "./musicFilesSlice";


export interface PlaylistType {
    id: string
    name: string
    description:string
    folderId: string
    songs: MusicFile[]
  }
interface PlaylistsState {
    currentPlaylist: PlaylistType | null;
    playlists: PlaylistType[];
    currentPlaylistId: string | null;
    currentFolderId: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: PlaylistsState = {
    currentPlaylist: null,
    playlists: [],
    currentPlaylistId: null,
    currentFolderId: null,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchPlaylists = createAsyncThunk("playlists/fetch", async () => {
    const response = await api.get('/playlists');
    return response.data;
});
export const fetchPlaylistById = createAsyncThunk(
    "playlists/fetchById",
    async (playlistId: string) => {
        const response = await api.get(`/playlists/${playlistId}`);
        return response.data;
    }
);

export const createPlaylist = createAsyncThunk("playlists/create", async (playlistData: { name: string; description?: string }) => {
    const response = await api.post('/playlists', playlistData);
    return response.data;
});

export const deletePlaylist = createAsyncThunk("playlists/delete", async (playlistId: string) => {
    await api.delete(`/playlists/${playlistId}`);
    return playlistId;
});

// New async thunks
export const removeSongFromPlaylist = createAsyncThunk(
    "playlists/removeSong",
    async ({ playlistId, songId }: { playlistId: string; songId: number }) => {
        await api.delete(`/playlists/${playlistId}/songs/${songId}`);
        return { playlistId, songId };
    }
);

export const addSongToPlaylist = createAsyncThunk(
    "playlists/addSong",
    async ({ playlistId, songId }: { playlistId: string; songId: number }) => {
      await api.post(`/playlists/${playlistId}/songs`, { SongId: songId });
      const response = await api.get(`/playlists/${playlistId}`);
      return response.data;
    }
  );
  


export const updatePlaylist = createAsyncThunk(
    "playlists/update",
    async ({ id, name, description }: { id: string, name: string, description: string }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/playlists/${id}`, { name, description });
        return response.data; // Assume that the backend returns the updated playlist
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update playlist");
      }
    }
  );


  export const generatePlaylistByPrompt = createAsyncThunk(
    "playlists/generateByPrompt",
    async ({ prompt }: { prompt: string }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/playlists/generate_playlist_by_prompt`, { prompt});
        return response.data; // Assume that the backend returns the updated playlist
        } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update playlist");
      }
    }
  );

export const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        setCurrentPlaylist: (state, action: PayloadAction<string | null>) => {
            state.currentPlaylistId = action.payload;
        },
        setCurrentFolder: (state, action: PayloadAction<string | null>) => {
            state.currentFolderId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlaylists.fulfilled, (state, action) => {
                state.playlists = action.payload;
            })
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.playlists.push(action.payload);
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.playlists = state.playlists.filter((p) => p.id !== action.payload);
            })
           
            // Handling removeSongFromPlaylist
            .addCase(removeSongFromPlaylist.fulfilled, (state, action) => {
                const { playlistId, songId } = action.payload;
                const playlist = state.playlists.find(p => p.id === playlistId);
                if (playlist) {
                    playlist.songs = playlist.songs.filter(song => song.id !== songId);
                }
            })
           .addCase(updatePlaylist.fulfilled, (state, action) => {
            const index = state.playlists.findIndex(
              (playlist) => playlist.id === action.payload.id
            );
            if (index !== -1) {
              state.playlists[index] = action.payload;
            }
          })
          .addCase(updatePlaylist.rejected, (state, action) => {
            state.error = action.payload as string;
          })
          .addCase(fetchPlaylistById.fulfilled, (state, action) => {
            const updatedPlaylist = action.payload;
            const index = state.playlists.findIndex(p => p.id === updatedPlaylist.id);
            if (index !== -1) {
                state.playlists[index] = updatedPlaylist;
            }
        })
            .addCase(generatePlaylistByPrompt.fulfilled, (state, action) => {
                const generatedPlaylist = action.payload;
                state.playlists.push(generatedPlaylist);
                state.currentPlaylist = generatedPlaylist;
            })
            .addCase(generatePlaylistByPrompt.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(addSongToPlaylist.fulfilled, (state, action) => {
                const updatedPlaylist = action.payload;
                const index = state.playlists.findIndex(p => p.id === updatedPlaylist.id);
                if (index !== -1) {
                    state.playlists[index] = updatedPlaylist;
                } else {
                    state.playlists.push(updatedPlaylist);
                }
            })
            
                    
    },
});

// Selectors
export const selectPlaylists = (state: RootState) => state.playlists.playlists;

export const selectPlaylistWithSongs = (state: RootState, playlistId: string) => {
    return state.playlists.playlists.find(playlist => playlist.id === playlistId);
};
export const selectPlaylistsInCurrentFolder = (state: RootState) => 
    state.playlists.playlists.filter(playlist => playlist.folderId === state.playlists.currentFolderId)
  
export const selectCurrentPlaylist = (state: RootState) => state.playlists.currentPlaylist;

export const { setCurrentPlaylist } = playlistsSlice.actions;
export default playlistsSlice.reducer;
