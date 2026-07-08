import axios, { AxiosInstance } from 'axios'
import { API_CONFIG, TIMEOUTS } from '@constants/api'
import { HttpException, PaginatedResponse, PlanoSaude } from '@/types'

export interface IPlanoSaudeService {
  getAll(page: number, size: number): Promise<PaginatedResponse<PlanoSaude>>
  getById(id: number): Promise<PlanoSaude>
  create(data: Omit<PlanoSaude, 'id'>): Promise<PlanoSaude>
  update(id: number, data: Partial<PlanoSaude>): Promise<PlanoSaude>
  delete(id: number): Promise<void>
}

export class PlanoSaudeService implements IPlanoSaudeService {
  private apiClient: AxiosInstance

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: TIMEOUTS.MEDIUM,
    })

    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('alles_access_token')
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
  }

  async getAll(page: number, size: number): Promise<PaginatedResponse<PlanoSaude>> {
    try {
      const response = await this.apiClient.get<PaginatedResponse<PlanoSaude>>(
        API_CONFIG.ENDPOINTS.PLANOS_SAUDE,
        { params: { page, size } },
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getById(id: number): Promise<PlanoSaude> {
    try {
      const response = await this.apiClient.get<PlanoSaude>(
        `${API_CONFIG.ENDPOINTS.PLANOS_SAUDE}/${id}`,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async create(data: Omit<PlanoSaude, 'id'>): Promise<PlanoSaude> {
    try {
      const payload = { nome: data.nome, descricao: data.descricao }
      const response = await this.apiClient.post<PlanoSaude>(
        API_CONFIG.ENDPOINTS.PLANOS_SAUDE,
        payload,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async update(id: number, data: Partial<PlanoSaude>): Promise<PlanoSaude> {
    try {
      const payload = { nome: data.nome, descricao: data.descricao }
      const response = await this.apiClient.put<PlanoSaude>(
        `${API_CONFIG.ENDPOINTS.PLANOS_SAUDE}/${id}`,
        payload,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`${API_CONFIG.ENDPOINTS.PLANOS_SAUDE}/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        'Erro ao processar plano de saúde'
      return new HttpException(status, message, error.response?.data as any)
    }
    return new Error('Erro desconhecido ao processar plano de saúde')
  }
}

export const planoSaudeService = new PlanoSaudeService()
