import axios from 'axios'
import { echo } from '@laravel/echo-react'

const BaseUrl = import.meta.env.VITE_API_URL;


export type ApiSuccessResponse<T> = {
  data: T;
  status: number;
  success: true;
  extra: Record<string, unknown>;
}

export type ApiErrorResponse = {
  status: false;
  data: null;
  message: string;
  error_code: string;
}

const api = axios.create({
  baseURL: `${BaseUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
})

api.interceptors.request.use((config) => {
  const socketId = echo()?.socketId?.() ?? ''
  if (socketId) {
    config.headers['X-Socket-ID'] = socketId
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data ?? error.message);
  }
)

export default api


