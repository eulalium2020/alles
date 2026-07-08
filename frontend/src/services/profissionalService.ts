import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG, TIMEOUTS } from '@constants/api'
import { Profissional, PaginatedResponse, HttpException } from '@/types'

/**
 * 👨‍⚕️ Interface para o serviço de Profissionais (SOLID - Interface Segregation)
 */
export interface IProfissionalService {
  getAll(page: number, pageSize: number): Promise<PaginatedResponse<Profissional>>
  getById(id: number): Promise<Profissional>
  create(data: Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Profissional>
  update(id: number, data: Partial<Profissional>): Promise<Profissional>
  delete(id: number): Promise<void>
}

/**
 * 👨‍⚕️ Implementação do serviço de Profissionais
 * Responsável por comunicação com API de profissionais
 */
export class ProfissionalService implements IProfissionalService {
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
   * 📋 Listar profissionais com paginação
   */
  async getAll(page: number, pageSize: number): Promise<PaginatedResponse<Profissional>> {
    try {
      const response = await this.apiClient.get<PaginatedResponse<Profissional>>(
        '/profissionais',
        {
          params: { page, pageSize },
        },
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🔍 Obter profissional por ID
   */
  async getById(id: number): Promise<Profissional> {
    try {
      const response = await this.apiClient.get<Profissional>(`/profissionais/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ➕ Criar novo profissional
   */
  async create(data: Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Profissional> {
    try {
      const response = await this.apiClient.post<Profissional>('/profissionais', data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ✏️ Atualizar profissional
   */
  async update(id: number, data: Partial<Profissional>): Promise<Profissional> {
    try {
      const response = await this.apiClient.put<Profissional>(`/profissionais/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🗑️ Deletar profissional
   */
  async delete(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/profissionais/${id}`)
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
        (error.response?.data as any)?.message || error.message || 'Erro ao processar profissional'

      return new HttpException(status, message, error.response?.data as any)
    }

    return new Error('Erro desconhecido ao processar profissional')
  }
}

export const profissionalService = new ProfissionalService()
