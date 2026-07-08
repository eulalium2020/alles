import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG, TOKEN_CONFIG, TIMEOUTS } from '@constants/api'
import { HttpException, LoginRequest, LoginResponse, Usuario } from '@/types'

/**
 * 🔐 Serviço abstrato para autenticação
 * Implementa padrão Strategy para flexibilidade futura
 */
export interface IAuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>
  refresh(refreshToken: string): Promise<LoginResponse>
  logout(): Promise<void>
  validateToken(): boolean
  getAccessToken(): string | null
  getUser(): Usuario | null
}

interface DecodedTokenPayload {
  exp?: number
  [key: string]: unknown
}

/**
 * 🔑 Implementação de Autenticação
 * Gerencia tokens JWT e sessão do usuário
 */
export class AuthService implements IAuthService {
  private apiClient: AxiosInstance
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private currentUser: Usuario | null = null

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: TIMEOUTS.MEDIUM,
    })
    this.loadFromStorage()
  }

  /**
   * 🔓 Login com email e senha
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials,
      )

      const { accessToken, refreshToken, usuario } = response.data
      this.setTokens(accessToken, refreshToken, usuario)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🔄 Renovar token de acesso
   */
  async refresh(refreshToken: string): Promise<LoginResponse> {
    const tokenToRefresh = refreshToken || this.refreshToken

    if (!tokenToRefresh) {
      throw new Error('Refresh token not available')
    }

    try {
      const response = await this.apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken: tokenToRefresh },
      )

      const { accessToken, usuario } = response.data
      this.accessToken = accessToken
      this.currentUser = usuario
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(TOKEN_CONFIG.USER_KEY, JSON.stringify(usuario))
      return response.data
    } catch (error) {
      this.clearTokens()
      throw this.handleError(error)
    }
  }

  /**
   * 🚪 Logout
   */
  async logout(): Promise<void> {
    try {
      if (this.accessToken) {
        this.apiClient.defaults.headers.common['Authorization'] =
          `Bearer ${this.accessToken}`
        await this.apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
      }
    } finally {
      this.clearTokens()
    }
  }

  /**
   * ✅ Validar se token ainda é válido
   */
  validateToken(): boolean {
    if (!this.accessToken) return false

    try {
      const payload = this.decodeToken(this.accessToken)
      if (typeof payload.exp !== 'number') return false

      const expiresAt = payload.exp * 1000
      return expiresAt > Date.now()
    } catch {
      return false
    }
  }

  /**
   * 📥 Recuperar token de acesso
   */
  getAccessToken(): string | null {
    return this.accessToken
  }

  /**
   * 👤 Recuperar usuário autenticado
   */
  getUser(): Usuario | null {
    return this.currentUser
  }

  /**
   * 💾 Guardar tokens e usuário
   */
  private setTokens(
    accessToken: string,
    refreshToken: string,
    usuario: Usuario,
  ): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.currentUser = usuario

    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(TOKEN_CONFIG.USER_KEY, JSON.stringify(usuario))
  }

  /**
   * 🗑️ Limpar tokens
   */
  private clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null
    this.currentUser = null

    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_CONFIG.USER_KEY)
  }

  /**
   * 📂 Carregar tokens do localStorage
   */
  private loadFromStorage(): void {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
    const refresh = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)
    const user = localStorage.getItem(TOKEN_CONFIG.USER_KEY)

    if (token) this.accessToken = token
    if (refresh) this.refreshToken = refresh
    if (user) this.currentUser = JSON.parse(user)
  }

  /**
   * 🔓 Decodificar JWT (sem validação de assinatura)
   */
  private decodeToken(token: string): DecodedTokenPayload {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid token')

    return JSON.parse(atob(parts[1])) as DecodedTokenPayload
  }

  /**
   * ❌ Tratar erros da API
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      const status = axiosError.response?.status || 500
      const message =
        (axiosError.response?.data as any)?.message ||
        axiosError.message ||
        'Unknown error'

      return new HttpException(status, message, axiosError.response?.data as any)
    }

    return new Error('Unknown error occurred')
  }
}

// 📦 Singleton instance
export const authService = new AuthService()
