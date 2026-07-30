import axios, { AxiosError, AxiosInstance } from 'axios'
import { API_CONFIG, TIMEOUTS } from '@constants/api'
import { HttpException, PaginatedResponse, Perfil, Usuario } from '@/types'
import { adaptSpringPage } from '@utils/paginationAdapter'

export interface UsuarioCreatePayload {
  nome: string
  email: string
  senha: string
  cpf?: string
  telefone?: string
  perfil: Perfil
  ativo: boolean
}

export class UsuarioService {
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

  async getAll(page: number, pageSize: number): Promise<PaginatedResponse<Usuario>> {
    try {
      const response = await this.apiClient.get<any>(API_CONFIG.ENDPOINTS.USUARIOS, {
        params: { page, size: pageSize },
      })
      const pageData = adaptSpringPage<any>(response.data)
      return {
        ...pageData,
        content: pageData.content.map((item: any) => this.normalizeUsuario(item)),
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async create(payload: UsuarioCreatePayload): Promise<Usuario> {
    try {
      const response = await this.apiClient.post<any>(API_CONFIG.ENDPOINTS.USUARIOS, payload)
      return this.normalizeUsuario(response.data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getPerfis(): Promise<Perfil[]> {
    try {
      const response = await this.apiClient.get<Perfil[]>(`${API_CONFIG.ENDPOINTS.USUARIOS}/perfis`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private normalizeUsuario(data: any): Usuario {
    return {
      id: Number(data.id),
      nome: data.nome ?? '',
      email: data.email ?? '',
      cpf: data.cpf ?? '',
      telefone: data.telefone ?? '',
      perfil: data.perfil ?? 'PACIENTE',
      ativo: Boolean(data.ativo),
      criadoEm: data.criadoEm ?? data.dataCriacao ?? '',
      atualizadoEm: data.atualizadoEm ?? data.dataAtualizacao ?? '',
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message =
        (error.response?.data as any)?.message || error.message || 'Erro ao processar usuário'
      return new HttpException(status, message, error.response?.data as any)
    }

    return new Error('Erro desconhecido ao processar usuário')
  }
}

export const usuarioService = new UsuarioService()
