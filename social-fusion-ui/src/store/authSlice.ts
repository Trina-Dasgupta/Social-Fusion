import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePic?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  fullName: "",
  username: "",
  email: "",
  phoneNumber: "",
  profilePic: "",
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<Omit<UserState, "isAuthenticated" | "isLoading" | "error">>) => {
      state.fullName = action.payload.fullName;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.profilePic = action.payload.profilePic;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: () => initialState,
  },
});

export const { registerStart, registerSuccess, registerFailure, logout } = authSlice.actions;
export default authSlice.reducer;
