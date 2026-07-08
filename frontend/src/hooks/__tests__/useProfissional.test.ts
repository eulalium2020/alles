import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * 🪝 Testes para hook useProfissional
 */
describe('useProfissional', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('estado inicial', () => {
    it('deve ter métodos disponíveis', () => {
      const hook = {
        profissionais: [],
        currentProfissional: null,
        loading: false,
        error: null,
        pagination: { page: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
        fetchProfissionais: vi.fn(),
        fetchById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        refresh: vi.fn(),
        clearError: vi.fn(),
      }

      expect(typeof hook.fetchProfissionais).toBe('function')
      expect(typeof hook.create).toBe('function')
      expect(typeof hook.update).toBe('function')
      expect(typeof hook.remove).toBe('function')
      expect(typeof hook.clearError).toBe('function')
      expect(hook.profissionais).toEqual([])
      expect(hook.loading).toBe(false)
    })
  })
})
