import { api } from './api'
import { LoginRequest, LoginResponse, Usuario } from '../types'

interface BackendLoginResponse {
  token?: string
  accessToken?: string
  refreshToken: string
  email?: string
  perfil?: Usuario['perfil']
  usuarioId?: number
  usuario?: Usuario
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<BackendLoginResponse>('/auth/login', {
    email: credentials.email,
    senha: credentials.senha,
  })

  const data = response.data
  const accessToken = data.accessToken ?? data.token
  if (!accessToken || !data.refreshToken) {
    throw new Error('Resposta de autenticação inválida')
  }

  const usuario: Usuario = data.usuario ?? {
    id: data.usuarioId ?? 0,
    nome: data.email ?? 'Usuário',
    email: data.email ?? '',
    cpf: '',
    telefone: '',
    perfil: data.perfil ?? 'ADMIN',
    ativo: true,
    criadoEm: '',
    atualizadoEm: '',
  }

  return {
    accessToken,
    refreshToken: data.refreshToken,
    usuario,
  }
}

export async function logout() {
  await api.post('/auth/logout')
}
