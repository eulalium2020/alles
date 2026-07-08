import { useCallback, useState } from 'react'
import { Profissional, PaginatedResponse } from '@/types'
import { profissionalService } from '@services/profissionalService'

/**
 * 🪝 Estado gerenciado pelo hook useProfissional
 */
interface UseProfissionalState {
  profissionais: Profissional[]
  currentProfissional: Profissional | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    totalElements: number
    totalPages: number
  }
}

/**
 * 🪝 Hook para gerenciar Profissionais (SOLID - Single Responsibility)
 * Encapsula lógica de fetch, criação, atualização e deleção
 */
export function useProfissional() {
  const [state, setState] = useState<UseProfissionalState>({
    profissionais: [],
    currentProfissional: null,
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
  })

  /**
   * 📋 Carregar profissionais
   */
  const fetchProfissionais = useCallback(async (page: number = 0, pageSize: number = 10) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response: PaginatedResponse<Profissional> = await profissionalService.getAll(
        page,
        pageSize,
      )

      setState((prev) => ({
        ...prev,
        profissionais: response.content,
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
      const errorMessage = err.message || 'Erro ao carregar profissionais'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  /**
   * 🔍 Carregar profissional por ID
   */
  const fetchById = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const profissional = await profissionalService.getById(id)
      setState((prev) => ({
        ...prev,
        currentProfissional: profissional,
        loading: false,
      }))

      return profissional
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar profissional'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  /**
   * ➕ Criar profissional
   */
  const create = useCallback(
    async (data: Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const novo = await profissionalService.create(data)
        setState((prev) => ({
          ...prev,
          profissionais: [novo, ...prev.profissionais],
          currentProfissional: novo,
          loading: false,
        }))

        return novo
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao criar profissional'
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

  /**
   * ✏️ Atualizar profissional
   */
  const update = useCallback(
    async (id: number, data: Partial<Profissional>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const atualizado = await profissionalService.update(id, data)
        setState((prev) => ({
          ...prev,
          profissionais: prev.profissionais.map((p) => (p.id === id ? atualizado : p)),
          currentProfissional: prev.currentProfissional?.id === id ? atualizado : prev.currentProfissional,
          loading: false,
        }))

        return atualizado
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao atualizar profissional'
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

  /**
   * 🗑️ Deletar profissional
   */
  const remove = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      await profissionalService.delete(id)
      setState((prev) => ({
        ...prev,
        profissionais: prev.profissionais.filter((p) => p.id !== id),
        loading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar profissional'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  /**
   * 🔄 Recarregar dados
   */
  const refresh = useCallback(
    () => fetchProfissionais(state.pagination.page, state.pagination.pageSize),
    [fetchProfissionais, state.pagination.page, state.pagination.pageSize],
  )

  /**
   * 🧹 Limpar estado
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    fetchProfissionais,
    fetchById,
    create,
    update,
    remove,
    refresh,
    clearError,
  }
}
