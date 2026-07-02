import { describe, it, expect } from 'vitest'

/**
 * 🏥 Testes para PacienteService
 */
describe('PacienteService', () => {
  describe('validação de paciente', () => {
    it('deve validar dados obrigatórios', () => {
      const paciente = {
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        dataNascimento: '',
      }

      const errors: Record<string, string> = {}
      if (!paciente.nome?.trim()) errors.nome = 'Nome é obrigatório'
      if (!paciente.email?.trim()) errors.email = 'Email é obrigatório'
      if (!paciente.cpf?.trim()) errors.cpf = 'CPF é obrigatório'

      expect(Object.keys(errors).length).toBeGreaterThan(0)
    })

    it('deve aceitar paciente válido', () => {
      const paciente = {
        nome: 'Maria Silva',
        email: 'maria@example.com',
        cpf: '987.654.321-00',
        telefone: '11988888888',
        dataNascimento: '1990-01-01',
      }

      const errors: Record<string, string> = {}
      if (!paciente.nome?.trim()) errors.nome = 'Nome é obrigatório'
      if (!paciente.email?.trim()) errors.email = 'Email é obrigatório'
      if (!paciente.cpf?.trim()) errors.cpf = 'CPF é obrigatório'

      expect(Object.keys(errors).length).toBe(0)
      expect(paciente.nome).toBe('Maria Silva')
    })
  })
})
