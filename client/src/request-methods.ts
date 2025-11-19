import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'https://fread.onrender.com/api';

interface ApiError {
  message?: string;
  error?: string;
  type?: string;
}

export const publicRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };


    if (options.headers) {
      const incomingHeaders = new Headers(options.headers as HeadersInit);
      incomingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { 
          message: `Request failed with status ${response.status}` 
        };
      }
      throw new Error(errorData.message || errorData.error || 'Request failed');
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const userRequest: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

userRequest.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

userRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const typedUserRequest = {
  get: <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    return userRequest.get<T>(endpoint, config).then(response => response.data);
  },
  
  post: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return userRequest.post<T>(endpoint, data, config).then(response => response.data);
  },
  
  put: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return userRequest.put<T>(endpoint, data, config).then(response => response.data);
  },
  
  patch: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return userRequest.patch<T>(endpoint, data, config).then(response => response.data);
  },
  
  delete: <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    return userRequest.delete<T>(endpoint, config).then(response => response.data);
  },
};
