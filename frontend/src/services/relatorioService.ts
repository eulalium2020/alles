import axios, { AxiosInstance } from 'axios'
import { API_CONFIG, TOKEN_CONFIG, TIMEOUTS } from '@constants/api'
import { RelatorioMensal } from '@/types'

class RelatorioService {
  private apiClient: AxiosInstance

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: TIMEOUTS.LONG,
    })

    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
  }

  async getGerencial(mes: string): Promise<RelatorioMensal[]> {
    const response = await this.apiClient.get<RelatorioMensal[]>('/relatorios/gerencial', {
      params: { mes },
    })
    return response.data
  }

  async getProfissional(profissionalId: number, mes: string): Promise<RelatorioMensal> {
    const response = await this.apiClient.get<RelatorioMensal>('/relatorios/profissional', {
      params: { profissionalId, mes },
    })
    return response.data
  }
}

export const relatorioService = new RelatorioService()
