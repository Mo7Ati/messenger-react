import axios, { type AxiosRequestConfig } from 'axios'
import { echo } from '@laravel/echo-react'

const BaseUrl = import.meta.env.VITE_API_URL;


export type ApiSuccessResponse<T> = {
  data: T;
  status: number;
  success: true;
  extra: Record<string, unknown>;
}

/** Normalized error thrown by the API client (e.g. 404, 401, 500). */
export type ApiError = {
  status: number;
  message: string;
  error_code?: string;
  data?: unknown;
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
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status ?? 0
    const data = error.response?.data
    const message =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : typeof data === 'string'
          ? data
          : error.message ?? 'Request failed'
    const error_code =
      data && typeof data === 'object' && 'error_code' in data
        ? String((data as { error_code: unknown }).error_code)
        : undefined
    return Promise.reject({ status, message, error_code, data } satisfies ApiError)
  }
)

export default api as ApiClient


