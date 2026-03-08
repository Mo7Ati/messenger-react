import axios, { type AxiosRequestConfig } from 'axios'
import { echo } from '@laravel/echo-react'

const BaseUrl = import.meta.env.VITE_API_URL;


export type ApiSuccessResponse<T> = {
  data: T;
  status: number;
  success: true;
  extra: Record<string, any>;
}

export type ApiErrorResponse = {
  status: false;
  data: null;
  message: string;
  error_code: string;
}

/** API instance that returns unwrapped response data (no AxiosResponse). */
export interface ApiClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiSuccessResponse<T>>
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiSuccessResponse<T>>
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiSuccessResponse<T>>
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiSuccessResponse<T>>
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiSuccessResponse<T>>
  request<T = unknown>(config: AxiosRequestConfig): Promise<ApiSuccessResponse<T>>
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
  try {
    const socketId = echo()?.socketId?.() ?? ''
    if (socketId) {
      config.headers['X-Socket-ID'] = socketId
    }
  } catch {
    // Echo may not be configured yet (e.g. on login page); don't block the request
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data ?? error.message);
  }
)

export default api as ApiClient


