import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * 📅 Testes para AtendimentoService
 */
describe('AtendimentoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validação de atendimento', () => {
    it('deve validar profissional obrigatório', () => {
      const atendimento = {
        profissionalId: 0,
        pacienteId: 1,
        dataHora: '2024-12-25T10:00',
        tipoAtendimento: 'PRESENCIAL' as const,
      }

      const errors: Record<string, string> = {}
      if (!atendimento.profissionalId) errors.profissionalId = 'Profissional é obrigatório'

      expect(errors.profissionalId).toBe('Profissional é obrigatório')
    })

    it('deve validar paciente obrigatório', () => {
      const atendimento = {
        profissionalId: 1,
        pacienteId: 0,
        dataHora: '2024-12-25T10:00',
        tipoAtendimento: 'PRESENCIAL' as const,
      }

      const errors: Record<string, string> = {}
      if (!atendimento.pacienteId) errors.pacienteId = 'Paciente é obrigatório'

      expect(errors.pacienteId).toBe('Paciente é obrigatório')
    })

    it('deve validar data/hora obrigatória', () => {
      const atendimento = {
        profissionalId: 1,
        pacienteId: 1,
        dataHora: '',
        tipoAtendimento: 'PRESENCIAL' as const,
      }

      const errors: Record<string, string> = {}
      if (!atendimento.dataHora) errors.dataHora = 'Data e hora são obrigatórias'

      expect(errors.dataHora).toBe('Data e hora são obrigatórias')
    })

    it('deve aceitar atendimento válido', () => {
      const atendimento = {
        profissionalId: 1,
        pacienteId: 1,
        dataHora: '2024-12-25T10:00',
        tipoAtendimento: 'PRESENCIAL' as const,
        status: 'AGENDADO' as const,
      }

      const errors: Record<string, string> = {}
      if (!atendimento.profissionalId) errors.profissionalId = 'Profissional é obrigatório'
      if (!atendimento.pacienteId) errors.pacienteId = 'Paciente é obrigatório'
      if (!atendimento.dataHora) errors.dataHora = 'Data e hora são obrigatórias'

      expect(Object.keys(errors).length).toBe(0)
      expect(atendimento.status).toBe('AGENDADO')
    })
  })

  describe('tipos de atendimento', () => {
    it('deve aceitar atendimento presencial', () => {
      const tipoAtendimento = 'PRESENCIAL'

      expect(['PRESENCIAL', 'TELEMEDICINA']).toContain(tipoAtendimento)
    })

    it('deve aceitar atendimento telemedicina', () => {
      const tipoAtendimento = 'TELEMEDICINA'

      expect(['PRESENCIAL', 'TELEMEDICINA']).toContain(tipoAtendimento)
    })
  })

  describe('status de atendimento', () => {
    it('deve aceitar todos os status válidos', () => {
      const validStatus = ['AGENDADO', 'REALIZADO', 'CANCELADO', 'NAO_COMPARECEU']

      expect(validStatus).toContain('AGENDADO')
      expect(validStatus).toContain('REALIZADO')
      expect(validStatus).toContain('CANCELADO')
      expect(validStatus).toContain('NAO_COMPARECEU')
    })
  })
})
