import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG, TIMEOUTS } from '@constants/api'
import { Paciente, PaginatedResponse, HttpException } from '@/types'
import { adaptSpringPage } from '@utils/paginationAdapter'

/**
 * 🏥 Interface para o serviço de Pacientes (SOLID - Interface Segregation)
 */
export interface IPacienteService {
  getAll(page: number, pageSize: number): Promise<PaginatedResponse<Paciente>>
  getById(id: number): Promise<Paciente>
  create(data: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Paciente>
  update(id: number, data: Partial<Paciente>): Promise<Paciente>
  delete(id: number): Promise<void>
}

/**
 * 🏥 Implementação do serviço de Pacientes
 * Responsável por comunicação com API de pacientes
 */
export class PacienteService implements IPacienteService {
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
   * 📋 Listar pacientes com paginação
   */
  async getAll(page: number, pageSize: number): Promise<PaginatedResponse<Paciente>> {
    try {
      const response = await this.apiClient.get<any>('/pacientes', {
        params: { page, size: pageSize }, // Spring espera "size"
      })
      return adaptSpringPage(response.data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🔍 Obter paciente por ID
   */
  async getById(id: number): Promise<Paciente> {
    try {
      const response = await this.apiClient.get<Paciente>(`/pacientes/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ➕ Criar novo paciente
   */
  async create(data: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Paciente> {
    try {
      const response = await this.apiClient.post<Paciente>('/pacientes', data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ✏️ Atualizar paciente
   */
  async update(id: number, data: Partial<Paciente>): Promise<Paciente> {
    try {
      const response = await this.apiClient.put<Paciente>(`/pacientes/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🗑️ Deletar paciente
   */
  async delete(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/pacientes/${id}`)
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
        (error.response?.data as any)?.message || error.message || 'Erro ao processar paciente'

      return new HttpException(status, message, error.response?.data as any)
    }

    return new Error('Erro desconhecido ao processar paciente')
  }
}

export const pacienteService = new PacienteService()
