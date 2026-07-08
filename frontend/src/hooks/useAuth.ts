import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginRequest, LoginResponse } from '@/types'
import { authService } from '@services/authService'
import { useAuthStore } from '@store/authStore'

/**
 * 🪝 Hook para gerenciar fluxo de autenticação
 * Encapsula lógica de login, refresh e logout
 */
export function useAuth() {
  const navigate = useNavigate()
  const { setUsuario, setIsAuthenticated, setIsLoading, setError, logout } =
    useAuthStore()
  const [localError, setLocalError] = useState<string | null>(null)

  /**
   * 🔓 Executar login
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setIsLoading(true)
        setLocalError(null)

        const response: LoginResponse = await authService.login(credentials)

        setUsuario(response.usuario)
        setIsAuthenticated(true)
        navigate('/dashboard')

        return response
      } catch (error: any) {
        const message = error.message || 'Erro ao realizar login'
        setLocalError(message)
        setError(message)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, setUsuario, setIsAuthenticated, setIsLoading, setError],
  )

  /**
   * 🔄 Renovar token
   */
  const refresh = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('alles_refresh_token')
      if (!refreshToken) throw new Error('Refresh token not found')

      const response = await authService.refresh(refreshToken)
      setUsuario(response.usuario)

      return response
    } catch (error: any) {
      logout()
      navigate('/login')
      throw error
    }
  }, [setUsuario, logout, navigate])

  /**
   * 🚪 Executar logout
   */
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      logout()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setIsLoading(false)
    }
  }, [logout, navigate, setIsLoading])

  return {
    login,
    refresh,
    logout: handleLogout,
    error: localError,
  }
}
