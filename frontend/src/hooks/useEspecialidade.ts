import { useCallback, useState } from 'react'
import { Especialidade, PaginatedResponse } from '@/types'
import { especialidadeService } from '@services/especialidadeService'

interface UseEspecialidadeState {
  especialidades: Especialidade[]
  currentEspecialidade: Especialidade | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    totalElements: number
    totalPages: number
  }
}

export function useEspecialidade() {
  const [state, setState] = useState<UseEspecialidadeState>({
    especialidades: [],
    currentEspecialidade: null,
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
  })

  const fetchEspecialidades = useCallback(
    async (page: number = 0, pageSize: number = 10) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const response: PaginatedResponse<Especialidade> =
          await especialidadeService.getAll(page, pageSize)

        setState((prev) => ({
          ...prev,
          especialidades: response.content,
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
        const errorMessage = err.message || 'Erro ao carregar especialidades'
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        throw err
      }
    },
    [],
  )

  const fetchById = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const especialidade = await especialidadeService.getById(id)
      setState((prev) => ({
        ...prev,
        currentEspecialidade: especialidade,
        loading: false,
      }))

      return especialidade
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar especialidade'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  const create = useCallback(async (data: Omit<Especialidade, 'id'>) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const nova = await especialidadeService.create(data)
      setState((prev) => ({
        ...prev,
        especialidades: [nova, ...prev.especialidades],
        currentEspecialidade: nova,
        loading: false,
      }))

      return nova
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar especialidade'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  const update = useCallback(async (id: number, data: Partial<Especialidade>) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const atualizada = await especialidadeService.update(id, data)
      setState((prev) => ({
        ...prev,
        especialidades: prev.especialidades.map((e) => (e.id === id ? atualizada : e)),
        currentEspecialidade:
          prev.currentEspecialidade?.id === id ? atualizada : prev.currentEspecialidade,
        loading: false,
      }))

      return atualizada
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar especialidade'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  const remove = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      await especialidadeService.delete(id)
      setState((prev) => ({
        ...prev,
        especialidades: prev.especialidades.filter((e) => e.id !== id),
        loading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar especialidade'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  const refresh = useCallback(
    () => fetchEspecialidades(state.pagination.page, state.pagination.pageSize),
    [fetchEspecialidades, state.pagination.page, state.pagination.pageSize],
  )

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    fetchEspecialidades,
    fetchById,
    create,
    update,
    remove,
    refresh,
    clearError,
  }
}
