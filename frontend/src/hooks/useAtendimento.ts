import { useCallback, useState } from 'react'
import { Atendimento, AtendimentoComDetalhes, PaginatedResponse } from '@/types'
import { atendimentoService } from '@services/atendimentoService'

/**
 * 🪝 Estado gerenciado pelo hook useAtendimento
 */
interface UseAtendimentoState {
  atendimentos: AtendimentoComDetalhes[]
  currentAtendimento: AtendimentoComDetalhes | null
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
 * 🪝 Hook para gerenciar Atendimentos (SOLID - Single Responsibility)
 * Encapsula lógica de fetch, agendamento e gerenciamento de presença
 */
export function useAtendimento() {
  const [state, setState] = useState<UseAtendimentoState>({
    atendimentos: [],
    currentAtendimento: null,
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
  })

  /**
   * 📋 Carregar atendimentos
   */
  const fetchAtendimentos = useCallback(async (page: number = 0, pageSize: number = 10) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response: PaginatedResponse<AtendimentoComDetalhes> = await atendimentoService.getAll(
        page,
        pageSize,
      )

      setState((prev) => ({
        ...prev,
        atendimentos: response.content,
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
      const errorMessage = err.message || 'Erro ao carregar atendimentos'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  /**
   * 🔍 Carregar atendimento por ID
   */
  const fetchById = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const atendimento = await atendimentoService.getById(id)
      setState((prev) => ({
        ...prev,
        currentAtendimento: atendimento,
        loading: false,
      }))

      return atendimento
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar atendimento'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  /**
   * ➕ Agendar novo atendimento
   */
  const agendar = useCallback(
    async (data: Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const novo = await atendimentoService.create(data)
        setState((prev) => ({
          ...prev,
          atendimentos: [novo, ...prev.atendimentos],
          currentAtendimento: novo,
          loading: false,
        }))

        return novo
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao agendar atendimento'
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
   * ✏️ Atualizar atendimento
   */
  const update = useCallback(
    async (id: number, data: Partial<Atendimento>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const atualizado = await atendimentoService.update(id, data)
        setState((prev) => ({
          ...prev,
          atendimentos: prev.atendimentos.map((a) => (a.id === id ? atualizado : a)),
          currentAtendimento: prev.currentAtendimento?.id === id ? atualizado : prev.currentAtendimento,
          loading: false,
        }))

        return atualizado
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao atualizar atendimento'
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
   * ✅ Registrar presença do paciente
   */
  const registrarPresenca = useCallback(
    async (id: number, anotacoes?: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const atualizado = await atendimentoService.registrarPresenca(id, anotacoes)
        setState((prev) => ({
          ...prev,
          atendimentos: prev.atendimentos.map((a) => (a.id === id ? atualizado : a)),
          currentAtendimento: prev.currentAtendimento?.id === id ? atualizado : prev.currentAtendimento,
          loading: false,
        }))

        return atualizado
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao registrar presença'
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
   * ❌ Cancelar atendimento
   */
  const cancelar = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const atualizado = await atendimentoService.cancelar(id)
      setState((prev) => ({
        ...prev,
        atendimentos: prev.atendimentos.map((a) => (a.id === id ? atualizado : a)),
        currentAtendimento: prev.currentAtendimento?.id === id ? atualizado : prev.currentAtendimento,
        loading: false,
      }))

      return atualizado
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao cancelar atendimento'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  /**
   * 🗑️ Deletar atendimento
   */
  const remove = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      await atendimentoService.delete(id)
      setState((prev) => ({
        ...prev,
        atendimentos: prev.atendimentos.filter((a) => a.id !== id),
        loading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar atendimento'
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
    () => fetchAtendimentos(state.pagination.page, state.pagination.pageSize),
    [fetchAtendimentos, state.pagination.page, state.pagination.pageSize],
  )

  /**
   * 🧹 Limpar estado
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    fetchAtendimentos,
    fetchById,
    agendar,
    update,
    registrarPresenca,
    cancelar,
    remove,
    refresh,
    clearError,
  }
}
