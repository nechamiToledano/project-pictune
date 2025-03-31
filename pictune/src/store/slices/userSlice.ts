import api from "@/components/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserState {
  userName: string;
  email: string;
  isLoggedIn: boolean; // ✅ Add this to track if user is logged in
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userName: "",
  email: "",
  isLoggedIn: !!localStorage.getItem("token"), // ✅ Initialize from localStorage
  loading: false,
  error: null,
};

// Add this block below your existing actions
export const userSignup = createAsyncThunk(
  "user/signup",
  async (data: { userName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/profile");
      return response.data as UserState;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData: { userName: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// User Login ✅
export const userLogin = createAsyncThunk(
  "user/login",
  async ({ userName, password }: { userName: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signin", { userName, password });
      const { token, email: userEmail } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", userEmail);

      return { userName, email: userEmail, isLoggedIn: true };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// User Logout ✅
export const userLogout = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("email");

  return { userName: "", email: "", isLoggedIn: false };
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.userName = "";
      state.email = "";
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userName = action.payload.userName;
        state.email = action.payload.email;
        state.isLoggedIn = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userName = action.payload.userName;
        state.email = action.payload.email;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userName = action.payload.userName;
        state.email = action.payload.email;
        state.isLoggedIn = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      builder
  .addCase(userSignup.pending, (state) => {
    state.loading = true;
  })
  .addCase(userSignup.fulfilled, (state) => {
    state.loading = false;
    state.error = null;
  })
  .addCase(userSignup.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  })

      .addCase(userLogout.fulfilled, (state) => {
        state.userName = "";
        state.email = "";
        state.isLoggedIn = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
