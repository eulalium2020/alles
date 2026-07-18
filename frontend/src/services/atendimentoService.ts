import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG, TIMEOUTS } from '@constants/api'
import { Atendimento, AtendimentoComDetalhes, PaginatedResponse, HttpException } from '@/types'
import { adaptSpringPage } from '@utils/paginationAdapter'

/**
 * 📅 Interface para o serviço de Atendimentos (SOLID - Interface Segregation)
 */
export interface IAtendimentoService {
  getAll(page: number, pageSize: number): Promise<PaginatedResponse<AtendimentoComDetalhes>>
  getById(id: number): Promise<AtendimentoComDetalhes>
  create(data: Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<AtendimentoComDetalhes>
  update(id: number, data: Partial<Atendimento>): Promise<AtendimentoComDetalhes>
  delete(id: number): Promise<void>
  registrarPresenca(id: number, anotacoes?: string): Promise<AtendimentoComDetalhes>
  cancelar(id: number): Promise<AtendimentoComDetalhes>
}

/**
 * 📅 Implementação do serviço de Atendimentos
 * Responsável por comunicação com API de atendimentos
 */
export class AtendimentoService implements IAtendimentoService {
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
   * 📋 Listar atendimentos com paginação
   */
  async getAll(page: number, pageSize: number): Promise<PaginatedResponse<AtendimentoComDetalhes>> {
    try {
      const response = await this.apiClient.get<any>(
        '/atendimentos',
        {
          params: { page, size: pageSize }, // Spring espera "size", não "pageSize"
        },
      )
      return adaptSpringPage(response.data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🔍 Obter atendimento por ID
   */
  async getById(id: number): Promise<AtendimentoComDetalhes> {
    try {
      const response = await this.apiClient.get<AtendimentoComDetalhes>(`/atendimentos/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ➕ Criar novo atendimento
   */
  async create(
    data: Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'>,
  ): Promise<AtendimentoComDetalhes> {
    try {
      // Endpoint correto é /agendar com apenas os campos que o backend espera
      const response = await this.apiClient.post<AtendimentoComDetalhes>('/atendimentos/agendar', {
        profissionalId: data.profissionalId,
        pacienteId: data.pacienteId,
        dataHora: data.dataHora,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ✏️ Atualizar atendimento
   */
  async update(id: number, data: Partial<Atendimento>): Promise<AtendimentoComDetalhes> {
    try {
      const response = await this.apiClient.put<AtendimentoComDetalhes>(
        `/atendimentos/${id}`,
        {
          profissionalId: data.profissionalId,
          pacienteId: data.pacienteId,
          dataHora: data.dataHora,
        },
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 🗑️ Deletar atendimento
   */
  async delete(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/atendimentos/${id}`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ✅ Registrar presença do paciente
   */
  async registrarPresenca(id: number, anotacoes?: string): Promise<AtendimentoComDetalhes> {
    try {
      // Método e URL corretos: POST .../registrar (não PATCH .../presenca)
      const response = await this.apiClient.post<AtendimentoComDetalhes>(
        `/atendimentos/${id}/registrar`,
        { anotacoes: anotacoes ?? '' },
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * ❌ Cancelar atendimento
   */
  async cancelar(id: number, motivo?: string): Promise<AtendimentoComDetalhes> {
    try {
      // Método e URL corretos: POST .../cancelar com body {motivo}
      const response = await this.apiClient.post<AtendimentoComDetalhes>(
        `/atendimentos/${id}/cancelar`,
        { motivo: motivo ?? '' },
      )
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
        (error.response?.data as any)?.message || error.message || 'Erro ao processar atendimento'

      return new HttpException(status, message, error.response?.data as any)
    }

    return new Error('Erro desconhecido ao processar atendimento')
  }
}

export const atendimentoService = new AtendimentoService()
