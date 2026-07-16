import { useCallback } from 'react'
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { API_CONFIG, TOKEN_CONFIG, TIMEOUTS } from '@constants/api'
import { HttpException } from '@/types'

async function tryRefreshToken(client: AxiosInstance): Promise<string | null> {
  const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)
  if (!refreshToken) return null

  try {
    const res = await client.post<{ accessToken: string }>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
    )
    const newToken = res.data.accessToken
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, newToken)
    return newToken
  } catch {
    return null
  }
}

/**
 * 🪝 Hook para requisições HTTP com autenticação e auto-refresh de token
 */
export function useHttp() {
  const createApiClient = useCallback((): AxiosInstance => {
    const client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: TIMEOUTS.MEDIUM,
    })

    client.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const newToken = await tryRefreshToken(client)
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return client(originalRequest)
          }
          localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
          localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)
          localStorage.removeItem(TOKEN_CONFIG.USER_KEY)
          window.location.href = '/login'
        }
        return Promise.reject(error)
      },
    )

    return client
  }, [])

  const get = useCallback(
    async <T,>(endpoint: string, config?: any): Promise<T> => {
      try {
        const client = createApiClient()
        const response: AxiosResponse<T> = await client.get(endpoint, config)
        return response.data
      } catch (error) {
        throw handleError(error)
      }
    },
    [createApiClient],
  )

  const post = useCallback(
    async <T,>(endpoint: string, data?: any, config?: any): Promise<T> => {
      try {
        const client = createApiClient()
        const response: AxiosResponse<T> = await client.post(endpoint, data, config)
        return response.data
      } catch (error) {
        throw handleError(error)
      }
    },
    [createApiClient],
  )

  const put = useCallback(
    async <T,>(endpoint: string, data?: any, config?: any): Promise<T> => {
      try {
        const client = createApiClient()
        const response: AxiosResponse<T> = await client.put(endpoint, data, config)
        return response.data
      } catch (error) {
        throw handleError(error)
      }
    },
    [createApiClient],
  )

  const patch = useCallback(
    async <T,>(endpoint: string, data?: any, config?: any): Promise<T> => {
      try {
        const client = createApiClient()
        const response: AxiosResponse<T> = await client.patch(endpoint, data, config)
        return response.data
      } catch (error) {
        throw handleError(error)
      }
    },
    [createApiClient],
  )

  const del = useCallback(
    async <T,>(endpoint: string, config?: any): Promise<T> => {
      try {
        const client = createApiClient()
        const response: AxiosResponse<T> = await client.delete(endpoint, config)
        return response.data
      } catch (error) {
        throw handleError(error)
      }
    },
    [createApiClient],
  )

  return { get, post, put, patch, delete: del }
}

function handleError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500
    const message =
      (error.response?.data as any)?.message || error.message || 'Unknown error'
    return new HttpException(status, message, error.response?.data as any)
  }
  return new Error('Unknown error occurred')
}
