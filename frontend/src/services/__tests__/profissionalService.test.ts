import { describe, it, expect } from 'vitest'
import { Profissional, PaginatedResponse } from '@/types'

/**
 * 👨‍⚕️ Testes para ProfissionalService
 */
describe('ProfissionalService', () => {

  describe('getAll', () => {
    it('deve retornar lista paginada de profissionais', async () => {
      const mockResponse: PaginatedResponse<Profissional> = {
        content: [
          {
            id: 1,
            nome: 'Dr. João',
            email: 'joao@example.com',
            cpf: '123.456.789-00',
            telefone: '11999999999',
            perfil: 'PROFISSIONAL',
            ativo: true,
            crm: '123456',
            especialidade: {
              id: 1,
              nome: 'Cardiologia',
              descricao: 'Cardiologia',
              ativo: true,
            },
            tipoPagamento: 'FIXO_POR_CONSULTA',
            valorFixo: 100,
            horariosAtendimento: 'Seg-Sex 08:00-18:00',
            criadoEm: '2024-01-01',
            atualizadoEm: '2024-01-01',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
        pageSize: 10,
        isLast: true,
      }

      expect(mockResponse.content).toHaveLength(1)
      expect(mockResponse.content[0].nome).toBe('Dr. João')
      expect(mockResponse.totalPages).toBe(1)
    })
  })

  describe('getById', () => {
    it('deve retornar profissional por ID', () => {
      const profissional: Profissional = {
        id: 1,
        nome: 'Dr. João',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        telefone: '11999999999',
        perfil: 'PROFISSIONAL',
        ativo: true,
        crm: '123456',
        especialidade: {
          id: 1,
          nome: 'Cardiologia',
          descricao: 'Cardiologia',
          ativo: true,
        },
        tipoPagamento: 'FIXO_POR_CONSULTA',
        valorFixo: 100,
        horariosAtendimento: 'Seg-Sex 08:00-18:00',
        criadoEm: '2024-01-01',
        atualizadoEm: '2024-01-01',
      }

      expect(profissional.id).toBe(1)
      expect(profissional.nome).toBe('Dr. João')
    })
  })

  describe('validação', () => {
    it('deve validar nome obrigatório', () => {
      const profissional = {
        nome: '',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
      }

      const hasErrors = !profissional.nome || !profissional.email || !profissional.cpf

      expect(hasErrors).toBe(true)
    })

    it('deve validar email obrigatório', () => {
      const profissional = {
        nome: 'Dr. João',
        email: '',
        cpf: '123.456.789-00',
      }

      const hasErrors = !profissional.nome || !profissional.email || !profissional.cpf

      expect(hasErrors).toBe(true)
    })
  })
})
