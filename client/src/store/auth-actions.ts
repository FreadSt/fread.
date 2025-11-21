import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  logout,
  registerStart,
  registerFailure
} from './auth-slice.ts';
import { publicRequest } from '../request-methods.ts';
import {Dispatch} from "@reduxjs/toolkit";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
  }
  token: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export const login = (credentials: LoginCredentials) => {
  return async (dispatch: Dispatch) => {
    dispatch(loginStart());
    try {
      const response = await publicRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      const { user, token } = response;
      localStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
    } catch (err: any) {
      dispatch(loginFailure(err.message || 'Login failed'));
    }
  };
};

export const register = (credentials: RegisterCredentials) => {
  return async (dispatch: Dispatch) => {
    dispatch(registerStart());
    try {
      const response = await publicRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      const { user, token } = response;
      localStorage.setItem('token', token);
      dispatch(registerSuccess({ user, token }));
    } catch (err: any) {
      dispatch(registerFailure(err.message || 'Register failed'));
    }
  };
};

export const logoutUser = () => {
  return (dispatch: Dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('guestCart');
    dispatch(logout());
  };
};
