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
  isLoggedIn: false, // תקבע תמיד ל-false בהתחלה
  loading: false,
  error: null,
};


export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (credential: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google-login", { credential });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.userName);
      localStorage.setItem("email", user.email);

      return { userName: user.userName, email: user.email, isLoggedIn: true };
    } catch (error: any) {
  console.error("Google login error", error);
  return rejectWithValue(error.response?.data?.message || "Google login failed");
}

  }
);

export const autoLogin = createAsyncThunk(
  "user/autoLogin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const response = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        userName: response.data.userName,
        email: response.data.email,
      };
    } catch (error: any) {
      // הטוקן לא תקף או שגיאה אחרת – מחק אותו
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
      return rejectWithValue("Auto login failed");
    }
  }
);

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
      const response = await api.post("/auth/signin", { userName, password },
        { headers: { 'Content-Type': 'application/json' } }

      );
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", user.email);

      return { userName, email: user.email, isLoggedIn: true };
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
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.userName = action.payload.userName;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(autoLogin.rejected, (state) => {
        state.isLoggedIn = false;
        state.userName = "";
        state.email = "";
        state.loading = false;
      })
      .addCase(googleLogin.pending, (state) => {
    state.loading = true;
  })
  .addCase(googleLogin.fulfilled, (state, action) => {
    state.loading = false;
    state.userName = action.payload.userName;
    state.email = action.payload.email;
    state.isLoggedIn = true;
    state.error = null;
  })
  .addCase(googleLogin.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
