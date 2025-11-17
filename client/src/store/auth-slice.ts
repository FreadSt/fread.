import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  email: string
  name?: string
  role?: 'user' | 'admin';
}

interface AuthState {
  token: string | null;
  isFetching: boolean;
  currentUser: User | null;
  error: boolean
  errorMessage: string | null;
}

interface LoginSuccessPayload {
  user: User;
  token: string;
}

interface LoginFailurePayload {
  message?: string;
}

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
    loginStart(state) {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    loginSuccess(state, action: PayloadAction<LoginSuccessPayload>) {
      console.log(action.payload, 'payload user');
      state.isFetching = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.error = false;
      state.errorMessage = null;
    },
    loginFailure(state, action: PayloadAction<LoginFailurePayload | string>) {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = typeof action.payload === 'string' 
        ? action.payload 
        : action.payload?.message || 'Operation failed';
    },
    registerSuccess(state, action: PayloadAction<LoginSuccessPayload>) {
      state.isFetching = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.error = false;
      state.errorMessage = null;
    },
    logout(state) {
      state.currentUser = null;
      state.token = null;
      state.error = false;
      state.errorMessage = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, registerSuccess, logout } = authSlice.actions;

export default authSlice;
