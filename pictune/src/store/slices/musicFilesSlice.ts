import api from "@/components/Api"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

export interface MusicFile {
  duration: number
  artist: any
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
  extractedImageUrl?: string
  transcript: string | null
}

interface MusicFileState {
  files: MusicFile[]
  selectedFile: MusicFile | null
  songUrl: string | null
  songUrls: Record<number, string>
  loading: boolean
  error: string | null
  transcript: string | null
  lyricsError: string | null
  lyricsLoading: boolean
  images: Record<string, string>
}

const initialState: MusicFileState = {
  files: [],
  selectedFile: null,
  songUrl: null,
  songUrls: {},
  loading: false,
  error: null,
  transcript: null,
  lyricsError: null,
  lyricsLoading: false,
  images: {},
}

export const fetchImage = createAsyncThunk(
  "musicFiles/fetchImage",
  async (fileUrl: string, { getState, rejectWithValue }) => {
    const state = getState() as { musicFiles: MusicFileState }
    if (state.musicFiles.images[fileUrl]) {
      return { fileUrl, imageUrl: state.musicFiles.images[fileUrl] }
    }
    try {
      const response = await api.get(`/files/extract-image?fileKey=${fileUrl}`, { responseType: 'blob' })
      const imageUrl = URL.createObjectURL(response.data)
      return { fileUrl, imageUrl }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch image")
    }
  }
)

export const fetchMusicFiles = createAsyncThunk(
  "musicFiles/fetchAll",
  async (filters: { owner?: boolean; favorites?: boolean } = {}, { rejectWithValue }) => {
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

export const fetchMusicFileById = createAsyncThunk("musicFiles/fetchById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await api.get(`/files/${id}`)
    return response.data as MusicFile
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch music file")
  }
})

export const fetchMusicFileUrl = createAsyncThunk(
  "musicFiles/fetchUrl",
  async (id: number, { getState, rejectWithValue }) => {
    const state = getState() as { musicFiles: MusicFileState }
    if (state.musicFiles.songUrl && state.musicFiles.selectedFile?.id === id) {
      return state.musicFiles.songUrl
    }
    try {
      const response = await api.get(`/files/${id}/play`)
      return response.data.url as string
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch song URL")
    }
  }
)

export const toggleLikeMusicFile = createAsyncThunk<number, number, { rejectValue: string }>(
  "musicFiles/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/files/${id}/like`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle like status")
    }
  }
)

export const transcribeMusicFile = createAsyncThunk(
  'musicFiles/transcribe',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/files/${id}/transcribe`)
      return { id, transcript: response.data as string }
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
        state.lyricsLoading = false
        const file = state.files.find(f => f.id === action.payload.id)
        if (file) file.transcript = action.payload.transcript
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
        const file = state.files.find((f) => f.id === action.payload)
        if (file) file.isLiked = !file.isLiked
      })
      .addCase(toggleLikeMusicFile.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(transcribeMusicFile.pending, (state) => {
        state.lyricsLoading = true
        state.lyricsError = null
      })
      .addCase(transcribeMusicFile.rejected, (state, action) => {
        state.lyricsLoading = false
        state.lyricsError = action.payload as string
      })
      .addCase(fetchImage.fulfilled, (state, action: PayloadAction<{ fileUrl: string, imageUrl: string }>) => {
        if (!state.images[action.payload.fileUrl]) {
          state.images[action.payload.fileUrl] = action.payload.imageUrl
        }
      })
      .addCase(fetchMusicFileUrl.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.selectedFile) {
          state.songUrl = action.payload
          state.songUrls[state.selectedFile.id] = action.payload
        }
      })
  },
})

export const { clearSongUrl } = musicFilesSlice.actions
export default musicFilesSlice.reducer
