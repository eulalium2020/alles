import { useCallback, useState } from 'react'
import { PaginatedResponse, PlanoSaude } from '@types/index'
import { planoSaudeService } from '@services/planoSaudeService'

interface UsePlanoSaudeState {
  planos: PlanoSaude[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    totalElements: number
    totalPages: number
  }
}

export function usePlanoSaude() {
  const [state, setState] = useState<UsePlanoSaudeState>({
    planos: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
  })

  const fetchPlanos = useCallback(async (page: number = 0, size: number = 10) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const response: PaginatedResponse<PlanoSaude> = await planoSaudeService.getAll(page, size)
      setState((prev) => ({
        ...prev,
        planos: response.content,
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
      setState((prev) => ({ ...prev, loading: false, error: err.message }))
      throw err
    }
  }, [])

  const create = useCallback(async (data: Omit<PlanoSaude, 'id'>) => {
    const created = await planoSaudeService.create(data)
    setState((prev) => ({ ...prev, planos: [created, ...prev.planos] }))
    return created
  }, [])

  const update = useCallback(async (id: number, data: Partial<PlanoSaude>) => {
    const updated = await planoSaudeService.update(id, data)
    setState((prev) => ({
      ...prev,
      planos: prev.planos.map((p) => (p.id === id ? updated : p)),
    }))
    return updated
  }, [])

  const remove = useCallback(async (id: number) => {
    await planoSaudeService.delete(id)
    setState((prev) => ({ ...prev, planos: prev.planos.filter((p) => p.id !== id) }))
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return { ...state, fetchPlanos, create, update, remove, clearError }
}
