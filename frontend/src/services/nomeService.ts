import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG, TIMEOUTS } from '@constants/api'
import { HttpException } from '@/types'

/**
 * 📋 Interface para item com nome
 */
export interface NomeItem {
  id: number
  nome: string
  display: string
  [key: string]: any
}

/**
 * 📋 Interface para o serviço de Nomes (SOLID - Interface Segregation)
 */
export interface INomeService {
  getProfissionaisNomes(): Promise<NomeItem[]>
  getPacientesNomes(): Promise<NomeItem[]>
  getEspecialidadesNomes(): Promise<NomeItem[]>
  getPlanosNomes(): Promise<NomeItem[]>
  getProfissionalPorNome(nome: string): Promise<any>
  getPacientePorNome(nome: string): Promise<any>
  getEspecialidadePorNome(nome: string): Promise<any>
}

/**
 * 📋 Implementação do serviço de Nomes
 * Responsável por comunicação com endpoints de listagem de nomes
 */
export class NomeService implements INomeService {
  private apiClient: AxiosInstance

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: TIMEOUTS.MEDIUM,
    })

    this.setupInterceptors()
  }

  /**
   * Configurar interceptadores para adicionar token JWT
   */
  private setupInterceptors(): void {
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('alles_access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('alles_access_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      },
    )
  }

  /**
   * 👨‍⚕️ Obter lista de profissionais com display
   */
  async getProfissionaisNomes(): Promise<NomeItem[]> {
    try {
      const response = await this.apiClient.get<NomeItem[]>('/profissionais/nomes')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 👤 Obter lista de pacientes com display
   */
  async getPacientesNomes(): Promise<NomeItem[]> {
    try {
      const response = await this.apiClient.get<NomeItem[]>('/pacientes/nomes')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🏥 Obter lista de especialidades com display
   */
  async getEspecialidadesNomes(): Promise<NomeItem[]> {
    try {
      const response = await this.apiClient.get<NomeItem[]>('/especialidades/nomes')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 💳 Obter lista de planos de saúde com display
   */
  async getPlanosNomes(): Promise<NomeItem[]> {
    try {
      const response = await this.apiClient.get<NomeItem[]>('/planos-saude/nomes')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 👨‍⚕️ Obter profissional por nome
   */
  async getProfissionalPorNome(nome: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/profissionais/by-nome/${encodeURIComponent(nome)}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 👤 Obter paciente por nome
   */
  async getPacientePorNome(nome: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/pacientes/by-nome/${encodeURIComponent(nome)}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🏥 Obter especialidade por nome
   */
  async getEspecialidadePorNome(nome: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/especialidades/by-nome/${encodeURIComponent(nome)}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ❌ Tratamento de erros
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message =
        (error.response?.data as any)?.message || error.message || 'Erro ao buscar nomes'

      return new HttpException(status, message, error.response?.data as any)
    }

    return new Error('Erro desconhecido ao buscar nomes')
  }
}

export const nomeService = new NomeService()
