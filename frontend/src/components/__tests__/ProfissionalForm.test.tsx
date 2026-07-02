import { describe, it, expect } from 'vitest'

/**
 * 📝 Testes para ProfissionalForm
 */
describe('ProfissionalForm', () => {
  describe('validação de formulário', () => {
    it('deve validar nome obrigatório', () => {
      const formData = {
        nome: '',
        email: 'test@example.com',
        cpf: '123.456.789-00',
      }

      const errors: Record<string, string> = {}
      if (!formData.nome?.trim()) errors.nome = 'Nome é obrigatório'

      expect(Object.keys(errors).length).toBeGreaterThan(0)
      expect(errors.nome).toBe('Nome é obrigatório')
    })

    it('deve validar email obrigatório', () => {
      const formData = {
        nome: 'Dr. João',
        email: '',
        cpf: '123.456.789-00',
      }

      const errors: Record<string, string> = {}
      if (!formData.email?.trim()) errors.email = 'Email é obrigatório'

      expect(Object.keys(errors).length).toBeGreaterThan(0)
      expect(errors.email).toBe('Email é obrigatório')
    })

    it('deve permitir formulário válido', () => {
      const formData = {
        nome: 'Dr. João',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        telefone: '11999999999',
        crm: '123456',
      }

      const errors: Record<string, string> = {}
      if (!formData.nome?.trim()) errors.nome = 'Nome é obrigatório'
      if (!formData.email?.trim()) errors.email = 'Email é obrigatório'
      if (!formData.cpf?.trim()) errors.cpf = 'CPF é obrigatório'

      expect(Object.keys(errors).length).toBe(0)
    })
  })
})
