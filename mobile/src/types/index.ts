export type Perfil = 'ADMIN' | 'PROFISSIONAL' | 'PACIENTE' | 'GERENTE'

export interface Usuario {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string
  perfil: Perfil
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  usuario: Usuario
}

export interface Profissional {
  id: number
  crm: string
  usuario: {
    email: string
  }
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
}
