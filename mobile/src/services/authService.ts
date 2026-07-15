import { api } from './api'
import { LoginRequest, LoginResponse } from '../types'

export async function login(credentials: LoginRequest) {
  const response = await api.post<LoginResponse>('/auth/login', credentials)
  return response.data
}

export async function logout() {
  await api.post('/auth/logout')
}
