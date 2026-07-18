import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG, TIMEOUTS } from '@constants/api'
import { Especialidade, PaginatedResponse, HttpException } from '@/types'
import { adaptSpringPage } from '@utils/paginationAdapter'

export interface IEspecialidadeService {
  getAll(page: number, pageSize: number): Promise<PaginatedResponse<Especialidade>>
  getById(id: number): Promise<Especialidade>
  create(data: Omit<Especialidade, 'id'>): Promise<Especialidade>
  update(id: number, data: Partial<Especialidade>): Promise<Especialidade>
  delete(id: number): Promise<void>
}

export class EspecialidadeService implements IEspecialidadeService {
  private apiClient: AxiosInstance

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: TIMEOUTS.MEDIUM,
    })

    this.setupInterceptors()
  }

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

  async getAll(page: number, pageSize: number): Promise<PaginatedResponse<Especialidade>> {
    try {
      const response = await this.apiClient.get<any>('/especialidades', {
        params: { page, size: pageSize },
      })
      return adaptSpringPage(response.data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getById(id: number): Promise<Especialidade> {
    try {
      const response = await this.apiClient.get<Especialidade>(`/especialidades/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async create(data: Omit<Especialidade, 'id'>): Promise<Especialidade> {
    try {
      const response = await this.apiClient.post<Especialidade>('/especialidades', data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async update(id: number, data: Partial<Especialidade>): Promise<Especialidade> {
    try {
      const response = await this.apiClient.put<Especialidade>(`/especialidades/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/especialidades/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message =
        (error.response?.data as any)?.message || error.message || 'Erro ao processar especialidade'

      return new HttpException(status, message, error.response?.data as any)
    }

    return new Error('Erro desconhecido ao processar especialidade')
  }
}

export const especialidadeService = new EspecialidadeService()
