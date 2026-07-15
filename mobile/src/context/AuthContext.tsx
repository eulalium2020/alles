import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LoginRequest, Usuario } from '../types'
import { clearAuthSession, getStoredUser, saveAuthSession } from '../services/storage'
import * as authService from '../services/authService'

interface AuthContextValue {
  user: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStoredUser()
      .then(setUser)
      .finally(() => setIsLoading(false))
  }, [])

  async function login(credentials: LoginRequest) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.login(credentials)
      await saveAuthSession(
        response.accessToken,
        response.refreshToken,
        response.usuario,
      )
      setUser(response.usuario)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Falha no login')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    try {
      await authService.logout()
    } finally {
      await clearAuthSession()
      setUser(null)
      setIsLoading(false)
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      logout,
    }),
    [user, isLoading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
