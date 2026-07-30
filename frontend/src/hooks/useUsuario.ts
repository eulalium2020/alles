import { useCallback, useState } from 'react'
import { PaginatedResponse, Perfil, Usuario } from '@/types'
import { usuarioService, UsuarioCreatePayload } from '@services/usuarioService'

interface UseUsuarioState {
  usuarios: Usuario[]
  perfis: Perfil[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    totalElements: number
    totalPages: number
  }
}

export function useUsuario() {
  const [state, setState] = useState<UseUsuarioState>({
    usuarios: [],
    perfis: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
  })

  const fetchUsuarios = useCallback(async (page: number = 0, pageSize: number = 10) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const response: PaginatedResponse<Usuario> = await usuarioService.getAll(page, pageSize)

      setState((prev) => ({
        ...prev,
        usuarios: response.content,
        pagination: {
          page: response.currentPage,
          pageSize: response.pageSize,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        },
        loading: false,
      }))

      return response
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Erro ao carregar usuários',
      }))
      throw err
    }
  }, [])

  const fetchPerfis = useCallback(async () => {
    try {
      const perfis = await usuarioService.getPerfis()
      setState((prev) => ({ ...prev, perfis }))
      return perfis
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.message || 'Erro ao carregar perfis',
      }))
      throw err
    }
  }, [])

  const create = useCallback(async (data: UsuarioCreatePayload) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const novo = await usuarioService.create(data)

      setState((prev) => ({
        ...prev,
        usuarios: [novo, ...prev.usuarios],
        loading: false,
      }))

      return novo
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Erro ao criar usuário',
      }))
      throw err
    }
  }, [])

  return {
    ...state,
    fetchUsuarios,
    fetchPerfis,
    create,
  }
}
