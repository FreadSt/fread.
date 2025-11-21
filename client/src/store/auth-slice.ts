import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface AuthState {
  token: string | null;
  isFetching: boolean;
  currentUser: User | null;
  error: boolean;
  errorMessage: string | null;
}

interface LoginSuccessPayload {
  user: User;
  token: string;
}

type AuthErrorPayload = string | { message?: string };

const initialState: AuthState = {
  currentUser: null,
  token: null,
  isFetching: false,
  error: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state): void {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    loginSuccess(state, action: PayloadAction<LoginSuccessPayload>): void {
      state.isFetching = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.error = false;
      state.errorMessage = null;
    },
    loginFailure(state, action: PayloadAction<AuthErrorPayload>): void {
      state.isFetching = false;
      state.error = true;
      state.errorMessage =
        typeof action.payload === 'string'
          ? action.payload
          : action.payload?.message || 'Login failed';
    },
    registerStart(state): void {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    registerSuccess(state, action: PayloadAction<LoginSuccessPayload>): void {
      state.isFetching = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.error = false;
      state.errorMessage = null;
    },
    registerFailure(state, action: PayloadAction<AuthErrorPayload>): void {
      state.isFetching = false;
      state.error = true;
      state.errorMessage =
        typeof action.payload === 'string'
          ? action.payload
          : action.payload?.message || 'Registration failed';
    },
    logout(state): void {
      state.currentUser = null;
      state.token = null;
      state.error = false;
      state.errorMessage = null;
      state.isFetching = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
} = authSlice.actions;

export default authSlice;
