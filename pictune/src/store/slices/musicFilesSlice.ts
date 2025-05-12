import api from "@/components/Api"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

export interface MusicFile {
  id: number
  fileName: string
  fileType: string
  folderId: number
  isDeleted: boolean
  ownerId: string
  s3Key: string
  size: number
  isLiked: boolean
  createdAt: string
  uploadedAt: string
  extractedImageUrl?: string // New field for the extracted image URL
  transcript:string|null
}

interface MusicFileState {
  files: MusicFile[];
  selectedFile: MusicFile | null;
  songUrl: string | null;
  songUrls: Record<number, string>; // New: Store URLs by file ID
  loading: boolean;
  error: string | null;
  transcript: string | null;
  lyricsError: string | null;
  lyricsLoading: boolean;
  images: Record<string, string>;
}

const initialState: MusicFileState = {
  files: [],
  selectedFile: null,
  songUrl: null,
  songUrls: {}, // Initialize as an empty object
  loading: false,
  error: null,
  transcript: null,
  lyricsError: null,
  lyricsLoading: false,
  images: {},
};


export const fetchImage = createAsyncThunk(
  "musicFiles/fetchImage",
  async (fileUrl: string, { getState, rejectWithValue }) => {
    const state = getState() as { musicFiles: MusicFileState };

    // Check if the image for this file has already been fetched
    if (state.musicFiles.images[fileUrl]) {
      return { fileUrl, imageUrl: state.musicFiles.images[fileUrl] };
    }

    try {
      
      const response = await api.get(`/files/extract-image?fileKey=${fileUrl}`, { responseType: 'blob' });
      const imageUrl = URL.createObjectURL(response.data); 
      return { fileUrl, imageUrl };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch image");
    }
  }
);

export const fetchMusicFiles = createAsyncThunk(
  "musicFiles/fetchAll",
  async (filters: { owner?: boolean ;favorites?: boolean; } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/files", {
        params: {
          owner: filters.owner || undefined,
          favorites: filters.favorites || undefined,

        },
      })
      return response.data as MusicFile[]
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch music files")
    }
  }
)


// Fetch a single music file
export const fetchMusicFileById = createAsyncThunk("musicFiles/fetchById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.get(`/files/${id}`)
    console.log(response.data);
    
    return response.data as MusicFile

  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch music file")
  }
})

export const fetchMusicFileUrl = createAsyncThunk(
  "musicFiles/fetchUrl",
  async (id: number, { getState, rejectWithValue }) => {
    const state = getState() as { musicFiles: MusicFileState };

    // Check if the URL for this song is already cached
    if (state.musicFiles.songUrl && state.musicFiles.selectedFile?.id === id) {
      return state.musicFiles.songUrl; // Return the existing URL
    }

    try {
      const response = await api.get(`/files/${id}/play`);
      return response.data.url as string;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch song URL");
    }
  }
);

export const toggleLikeMusicFile = createAsyncThunk<
  number, // Return type of the action (id)
  number, // Argument type of the action (id)
  { rejectValue: string } // Custom error handling
>(
  "musicFiles/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/files/${id}/like`);
      return id; // Returning the ID after liking the music
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle like status"
      );
    }
  }
);
export const transcribeMusicFile = createAsyncThunk(
  'musicFiles/transcribe',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/files/${id}/transcribe`)
      return { id, transcript: response.data as string } // 👈 חשוב
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to transcribe')
    }
  }
)



const musicFilesSlice = createSlice({
  name: "musicFiles",
  initialState,
  reducers: {
    clearSongUrl: (state) => {
      state.songUrl = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusicFiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMusicFiles.fulfilled, (state, action: PayloadAction<MusicFile[]>) => {
        state.loading = false
        state.files = action.payload
      })
      .addCase(fetchMusicFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(transcribeMusicFile.fulfilled, (state, action: PayloadAction<{ id: number, transcript: string }>) => {
        state.lyricsLoading = false;
      
        const file = state.files.find(f => f.id === action.payload.id)
        if (file) {
          file.transcript = action.payload.transcript
        }
      
        // אפשר גם לעדכן selectedFile אם זה הקובץ הפעיל
        if (state.selectedFile?.id === action.payload.id) {
          state.selectedFile.transcript = action.payload.transcript
        }
      })
      
      .addCase(fetchMusicFileById.fulfilled, (state, action: PayloadAction<MusicFile>) => {
        state.selectedFile = action.payload
      })

     
  
      .addCase(toggleLikeMusicFile.fulfilled, (state, action) => {
        if (state.selectedFile && state.selectedFile.id === action.payload) {
          state.selectedFile.isLiked = !state.selectedFile.isLiked
        }

        // Update the file in the list
        const file = state.files.find((f) => f.id === action.payload)
        if (file) file.isLiked = !file.isLiked
      })
      .addCase(toggleLikeMusicFile.rejected, (state, action) => {
        // Handle rejected action if needed
        state.error = action.payload as string;
      })
      .addCase(transcribeMusicFile.pending, (state) => {
        state.lyricsLoading = true;
        state.lyricsError = null;
      })
     
      .addCase(transcribeMusicFile.rejected, (state, action) => {
        state.lyricsLoading = false;
        state.lyricsError = action.payload as string;
      })
      
      .addCase(fetchImage.fulfilled, (state, action: PayloadAction<{ fileUrl: string, imageUrl: string }>) => {
        if (!state.images[action.payload.fileUrl]) {
          state.images[action.payload.fileUrl] = action.payload.imageUrl; // Store image URL in state
        }
      })
      .addCase(fetchMusicFileUrl.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.selectedFile) {
          state.songUrl = action.payload;
          state.songUrls[state.selectedFile.id] = action.payload; // Store URL by file ID
        }
      })
  
  },
})


export const { clearSongUrl } = musicFilesSlice.actions
export default musicFilesSlice.reducer
