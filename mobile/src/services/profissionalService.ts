import { api } from './api'
import { PaginatedResponse, Profissional } from '../types'

export async function listProfissionais() {
  const response = await api.get<PaginatedResponse<Profissional>>(
    '/profissionais?page=0&size=10',
  )
  return response.data.content
}
