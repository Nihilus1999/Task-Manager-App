import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "token";

const loadToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const initialState = {
  token: loadToken(),
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user ?? null;

      if (token) saveToken(token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      clearToken();
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
