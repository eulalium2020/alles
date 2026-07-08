import { useCallback } from 'react'
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { API_CONFIG, TOKEN_CONFIG, TIMEOUTS } from '@constants/api'
import { HttpException } from '@/types'

/**
 * 🪝 Hook para requisições HTTP com autenticação
 * Injeta automaticamente JWT no header Authorization
 * Trata erros e expiração de tokens
 */
export function useHttp() {
  const createApiClient = useCallback((): AxiosInstance => {
    const client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: TIMEOUTS.MEDIUM,
    })

    // Interceptor para adicionar token no header
    client.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Interceptor para tratar erros
    client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado, redirecionar para login
          localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
          window.location.href = '/login'
        }
        return Promise.reject(error)
      },
    )

    return client
  }, [])

  /**
   * GET request
   */
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

  /**
   * POST request
   */
  const post = useCallback(
    async <T,>(endpoint: string, data?: any, config?: any): Promise<T> => {
      try {
        const client = createApiClient()
        const response: AxiosResponse<T> = await client.post(
          endpoint,
          data,
          config,
        )
        return response.data
      } catch (error) {
        throw handleError(error)
      }
    },
    [createApiClient],
  )

  /**
   * PUT request
   */
  const put = useCallback(
    async <T,>(endpoint: string, data?: any, config?: any): Promise<T> => {
      try {
        const client = createApiClient()
        const response: AxiosResponse<T> = await client.put(
          endpoint,
          data,
          config,
        )
        return response.data
      } catch (error) {
        throw handleError(error)
      }
    },
    [createApiClient],
  )

  /**
   * PATCH request
   */
  const patch = useCallback(
    async <T,>(endpoint: string, data?: any, config?: any): Promise<T> => {
      try {
        const client = createApiClient()
        const response: AxiosResponse<T> = await client.patch(
          endpoint,
          data,
          config,
        )
        return response.data
      } catch (error) {
        throw handleError(error)
      }
    },
    [createApiClient],
  )

  /**
   * DELETE request
   */
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

/**
 * ❌ Tratar erros de requisição
 */
function handleError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500
    const message =
      (error.response?.data as any)?.message || error.message || 'Unknown error'

    return new HttpException(status, message, error.response?.data as any)
  }

  return new Error('Unknown error occurred')
}
