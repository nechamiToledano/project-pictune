import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store" // Adjust according to your store location
import api from "@/components/Api";
export interface FolderType {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    playlistIds: string[];
    parentFolderId?: string;
}




// Example async action to fetch folders
export const fetchFolders = createAsyncThunk(
  'folders/fetchFolders',
  async () => {
    const response = await api.get('/folders') // Replace with your API call
    const data: FolderType[] = await response.data;
    return data
  }
)

// Async action to create a folder
export const createFolderAsync = createAsyncThunk(
  'folders/createFolder',
  async (folder: { name: string; description?: string }) => {
    const response = await api.post('/folders',folder);
        return response.data
  }
)

// Async action to delete a folder
export const deleteFolderAsync = createAsyncThunk(
  'folders/deleteFolder',
  async (folderId: string) => {
    await api.delete(`/folders/${folderId}`)
    return folderId
  }
)

interface FolderState {
  folders: FolderType[]
  currentFolder: FolderType | null
  loading: boolean
  error: string | null
}

const initialState: FolderState = {
  folders: [],
  currentFolder: null,
  loading: false,
  error: null,
}

// Reducer logic
const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setCurrentFolder: (state, action: PayloadAction<string>) => {
      const folder = state.folders.find((folder:FolderType) => folder.id === action.payload)
      if (folder) {
        state.currentFolder = folder
      }
    },
    setFolderDescription: (state, action: PayloadAction<{ folderId: string, description: string }>) => {
      const folder = state.folders.find((f:FolderType) => f.id === action.payload.folderId)
      if (folder) {
        folder.description = action.payload.description
      }
    },
  },
  extraReducers: (builder) => {
    // Handle async actions

    // Fetch folders
    builder.addCase(fetchFolders.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchFolders.fulfilled, (state, action) => {
      state.loading = false
      state.folders = action.payload
    })
    builder.addCase(fetchFolders.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch folders'
    })

    // Create folder
    builder.addCase(createFolderAsync.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createFolderAsync.fulfilled, (state, action) => {
      state.loading = false
      state.folders.push(action.payload)
    })
    builder.addCase(createFolderAsync.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to create folder'
    })

    // Delete folder
    builder.addCase(deleteFolderAsync.pending, (state) => {
      state.loading = true
    })
    builder.addCase(deleteFolderAsync.fulfilled, (state, action) => {
      state.loading = false
      state.folders = state.folders.filter((folder:FolderType) => folder.id !== action.payload)
      if (state.currentFolder?.id === action.payload) {
        state.currentFolder = null
      }
    })
    builder.addCase(deleteFolderAsync.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to delete folder'
    })
  },
})

export const { setCurrentFolder, setFolderDescription } = foldersSlice.actions

export const selectFolders = (state: RootState) => state.folders.folders
export const selectCurrentFolder = (state: RootState) => state.folders.currentFolder
export const selectLoading = (state: RootState) => state.folders.loading
export const selectError = (state: RootState) => state.folders.error

export default foldersSlice.reducer
