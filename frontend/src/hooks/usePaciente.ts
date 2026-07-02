import { useCallback, useState } from 'react'
import { Paciente, PaginatedResponse } from '@types/index'
import { pacienteService } from '@services/pacienteService'

/**
 * 🪝 Estado gerenciado pelo hook usePaciente
 */
interface UsePacienteState {
  pacientes: Paciente[]
  currentPaciente: Paciente | null
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
 * 🪝 Hook para gerenciar Pacientes (SOLID - Single Responsibility)
 * Encapsula lógica de fetch, criação, atualização e deleção
 */
export function usePaciente() {
  const [state, setState] = useState<UsePacienteState>({
    pacientes: [],
    currentPaciente: null,
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
  })

  /**
   * 📋 Carregar pacientes
   */
  const fetchPacientes = useCallback(async (page: number = 0, pageSize: number = 10) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response: PaginatedResponse<Paciente> = await pacienteService.getAll(page, pageSize)

      setState((prev) => ({
        ...prev,
        pacientes: response.content,
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
      const errorMessage = err.message || 'Erro ao carregar pacientes'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  /**
   * 🔍 Carregar paciente por ID
   */
  const fetchById = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const paciente = await pacienteService.getById(id)
      setState((prev) => ({
        ...prev,
        currentPaciente: paciente,
        loading: false,
      }))

      return paciente
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar paciente'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw err
    }
  }, [])

  /**
   * ➕ Criar paciente
   */
  const create = useCallback(
    async (data: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const novo = await pacienteService.create(data)
        setState((prev) => ({
          ...prev,
          pacientes: [novo, ...prev.pacientes],
          currentPaciente: novo,
          loading: false,
        }))

        return novo
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao criar paciente'
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
   * ✏️ Atualizar paciente
   */
  const update = useCallback(
    async (id: number, data: Partial<Paciente>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const atualizado = await pacienteService.update(id, data)
        setState((prev) => ({
          ...prev,
          pacientes: prev.pacientes.map((p) => (p.id === id ? atualizado : p)),
          currentPaciente: prev.currentPaciente?.id === id ? atualizado : prev.currentPaciente,
          loading: false,
        }))

        return atualizado
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao atualizar paciente'
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
   * 🗑️ Deletar paciente
   */
  const remove = useCallback(async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      await pacienteService.delete(id)
      setState((prev) => ({
        ...prev,
        pacientes: prev.pacientes.filter((p) => p.id !== id),
        loading: false,
      }))
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar paciente'
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
    () => fetchPacientes(state.pagination.page, state.pagination.pageSize),
    [fetchPacientes, state.pagination.page, state.pagination.pageSize],
  )

  /**
   * 🧹 Limpar estado
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    fetchPacientes,
    fetchById,
    create,
    update,
    remove,
    refresh,
    clearError,
  }
}
