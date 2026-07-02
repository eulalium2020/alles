import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Usuario, Perfil } from '@types/index'
import { authService } from '@services/authService'

interface AuthState {
  usuario: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  setUsuario: (usuario: Usuario | null) => void
  setIsAuthenticated: (isAuth: boolean) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Derived actions
  hasRole: (role: Perfil) => boolean
  canAccess: (requiredRoles: Perfil[]) => boolean
  logout: () => void
}

/**
 * 🏪 Store global de autenticação usando Zustand
 * Mantém estado da sessão do usuário com seletor e notificações
 */
export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    usuario: authService.getUser(),
    isAuthenticated: authService.validateToken(),
    isLoading: false,
    error: null,

    setUsuario: (usuario) => set({ usuario }),
    setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    hasRole: (role) => {
      const state = get()
      return state.usuario?.perfil === role
    },

    canAccess: (requiredRoles) => {
      const state = get()
      if (!state.usuario) return false
      return requiredRoles.includes(state.usuario.perfil)
    },

    logout: () => {
      set({
        usuario: null,
        isAuthenticated: false,
        error: null,
      })
      authService.logout()
    },
  })),
)

/**
 * Hooks para acessar partes específicas do store
 */
export const useUsuario = () => useAuthStore((state) => state.usuario)
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated)
export const useIsLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
export const useCanAccess = () => useAuthStore((state) => state.canAccess)
