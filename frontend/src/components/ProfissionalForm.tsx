import React, { useState } from 'react'
import { Profissional, Especialidade } from '@/types'
import { maskCPF, maskPhone, maskEmail, maskCRM, maskCurrency, maskPercentage } from '@/utils/inputMasks'

/**
 * 📝 Props para o formulário de Profissional
 */
interface ProfissionalFormProps {
  initialData?: Profissional
  onSubmit: (data: Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  especialidades?: Especialidade[]
}

/**
 * 📝 Formulário para criar/editar profissional
 */
export const ProfissionalForm: React.FC<ProfissionalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Profissional>>(
    initialData || {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      crm: '',
      tipoPagamento: 'FIXO_POR_CONSULTA',
      valorFixo: 0,
      percentualReceita: 0,
      horariosAtendimento: '',
      ativo: true,
    },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * Validar formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome?.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.email?.trim()) newErrors.email = 'Email é obrigatório'
    if (!formData.cpf?.trim()) newErrors.cpf = 'CPF é obrigatório'
    if (!formData.crm?.trim()) newErrors.crm = 'CRM é obrigatório'
    if (!formData.telefone?.trim()) newErrors.telefone = 'Telefone é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Submeter formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit(formData as Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm'>)
    } catch (err) {
      console.error('Erro ao enviar formulário:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome *</label>
          <input
            type="text"
            value={formData.nome || ''}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.nome && <span className="text-red-500 text-sm">{errors.nome}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">📧 Email *</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: maskEmail(e.target.value) })}
            placeholder="seu@email.com"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm font-medium mb-1">🆔 CPF *</label>
          <input
            type="text"
            value={formData.cpf || ''}
            onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
            placeholder="000.000.000-00"
            maxLength="14"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cpf ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf}</span>}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium mb-1">📱 Telefone *</label>
          <input
            type="tel"
            value={formData.telefone || ''}
            onChange={(e) => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
            placeholder="(11) 99999-9999"
            maxLength="15"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.telefone ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.telefone && <span className="text-red-500 text-sm">{errors.telefone}</span>}
        </div>

        {/* Órgão de Classe (CRM) */}
        <div>
          <label className="block text-sm font-medium mb-1">📜 Órgão de Classe *</label>
          <input
            type="text"
            value={formData.crm || ''}
            onChange={(e) => setFormData({ ...formData, crm: maskCRM(e.target.value) })}
            placeholder="123456/SP"
            maxLength="9"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.crm ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.crm && <span className="text-red-500 text-sm">{errors.crm}</span>}
        </div>

        {/* Tipo de Pagamento */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo Pagamento</label>
          <select
            value={formData.tipoPagamento || 'FIXO_POR_CONSULTA'}
            onChange={(e) =>
              setFormData({ ...formData, tipoPagamento: e.target.value as any })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="FIXO_POR_CONSULTA">Fixo por Consulta</option>
            <option value="PERCENTUAL_RECEITA">Percentual Receita</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>

        {/* Valor Fixo */}
        <div>
          <label className="block text-sm font-medium mb-1">💵 Valor Fixo (R$)</label>
          <input
            type="text"
            value={formData.valorFixo ? maskCurrency(formData.valorFixo) : ''}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '')
              const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
              setFormData({ ...formData, valorFixo: numValue })
            }}
            placeholder="R$ 0,00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Percentual Receita */}
        <div>
          <label className="block text-sm font-medium mb-1">📊 Percentual Receita (%)</label>
          <input
            type="text"
            value={formData.percentualReceita ? maskPercentage(formData.percentualReceita) : ''}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '')
              const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
              setFormData({ ...formData, percentualReceita: numValue })
            }}
            placeholder="0,00"
            maxLength="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Horários Atendimento */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Horários Atendimento</label>
          <input
            type="text"
            placeholder="Ex: Seg-Sex 08:00-18:00"
            value={formData.horariosAtendimento || ''}
            onChange={(e) =>
              setFormData({ ...formData, horariosAtendimento: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Ativo */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="ativo"
            checked={formData.ativo ?? true}
            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
            className="h-4 w-4 rounded"
            disabled={isLoading}
          />
          <label htmlFor="ativo" className="ml-2 text-sm font-medium">
            Ativo
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
