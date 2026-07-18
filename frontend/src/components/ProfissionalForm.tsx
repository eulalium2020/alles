import React, { useState } from 'react'
import { Profissional } from '@/types'
import { maskCPF, maskPhone, maskEmail, maskCRM, maskCurrency, maskPercentage } from '@/utils/inputMasks'

/**
 * 📝 Props para o formulário de Profissional
 */
interface ProfissionalFormProps {
  initialData?: Profissional
  onSubmit: (data: Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm' | 'perfil'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
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
      especialidade: '',
      tipoPagamento: 'FIXO_POR_CONSULTA',
      valorFixo: 0,
      valorConsultaParticular: 0,
      valorConsultaPlano: 0,
      percentualReceita: 0,
      descontoClinicaPercentual: 0,
      horariosAtendimento: '',
      ativo: true,
    },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  /**
   * Validar formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validações obrigatórias
    if (!formData.nome?.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.email?.trim()) newErrors.email = 'Email é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Email inválido'

    if (!formData.cpf?.trim()) newErrors.cpf = 'CPF é obrigatório'
    else if (formData.cpf.replace(/\D/g, '').length !== 11)
      newErrors.cpf = 'CPF deve ter 11 dígitos'

    if (!formData.telefone?.trim()) newErrors.telefone = 'Telefone é obrigatório'
    else if (formData.telefone.replace(/\D/g, '').length < 10)
      newErrors.telefone = 'Telefone deve ter pelo menos 10 dígitos'

    if (!formData.crm?.trim()) newErrors.crm = 'Órgão de classe é obrigatório'
    if (!formData.especialidade) newErrors.especialidade = 'Especialidade é obrigatória'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Submeter formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) return

    try {
      const payload = {
        ...formData,
        perfil: 'PROFISSIONAL' as const,
      } as Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm' | 'perfil'>

      await onSubmit(payload)
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Erro ao salvar profissional'
      setSubmitError(errorMsg)
      console.error('Erro ao enviar formulário:', err)
    }
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
      {/* Erro de Submissão */}
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Erro ao salvar</p>
            <p className="text-sm mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Seção 1: Dados Pessoais */}
      <div className="space-y-4 p-4 bg-white rounded-lg border-l-4 border-blue-500">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            1
          </span>
          Dados Pessoais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">👤 Nome Completo *</label>
            <input
              type="text"
              value={formData.nome || ''}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              onBlur={() => handleBlur('nome')}
              placeholder="Dr. João Silva"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.nome && touched.nome
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.nome && touched.nome && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.nome}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">📧 Email *</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: maskEmail(e.target.value) })}
              onBlur={() => handleBlur('email')}
              placeholder="dr@email.com"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.email && touched.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.email && touched.email && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.email}</span>
            )}
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium mb-1">🆔 CPF *</label>
            <input
              type="text"
              value={formData.cpf || ''}
              onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
              onBlur={() => handleBlur('cpf')}
              placeholder="000.000.000-00"
              maxLength="14"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.cpf && touched.cpf
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.cpf && touched.cpf && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.cpf}</span>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium mb-1">📱 Telefone *</label>
            <input
              type="tel"
              value={formData.telefone || ''}
              onChange={(e) => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
              onBlur={() => handleBlur('telefone')}
              placeholder="(11) 99999-9999"
              maxLength="15"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.telefone && touched.telefone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.telefone && touched.telefone && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.telefone}</span>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Informações Profissionais */}
      <div className="space-y-4 p-4 bg-white rounded-lg border-l-4 border-purple-500">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            2
          </span>
          Informações Profissionais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Órgão de Classe */}
          <div>
            <label className="block text-sm font-medium mb-1">📜 Órgão de Classe *</label>
            <input
              type="text"
              value={formData.crm || ''}
              onChange={(e) => setFormData({ ...formData, crm: maskCRM(e.target.value) })}
              onBlur={() => handleBlur('crm')}
              placeholder="123456/SP"
              maxLength="9"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.crm && touched.crm
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.crm && touched.crm && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.crm}</span>
            )}
          </div>

          {/* Especialidade */}
          <div>
            <label className="block text-sm font-medium mb-1">🏥 Especialidade *</label>
            <input
              type="text"
              value={formData.especialidade || ''}
              onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
              onBlur={() => handleBlur('especialidade')}
              placeholder="Ex: Cardiologia"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.especialidade && touched.especialidade
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.especialidade && touched.especialidade && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.especialidade}</span>
            )}
          </div>

          {/* Horários Atendimento */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">⏰ Horários de Atendimento</label>
            <input
              type="text"
              value={formData.horariosAtendimento || ''}
              onChange={(e) => setFormData({ ...formData, horariosAtendimento: e.target.value })}
              placeholder="Seg-Sex 08:00-18:00, Sab 09:00-13:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Seção 3: Informações Financeiras */}
      <div className="space-y-4 p-4 bg-white rounded-lg border-l-4 border-green-500">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            3
          </span>
          Informações Financeiras
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Pagamento */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">💰 Tipo de Pagamento</label>
            <select
              value={formData.tipoPagamento || 'FIXO_POR_CONSULTA'}
              onChange={(e) => setFormData({ ...formData, tipoPagamento: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            >
              <option value="FIXO_POR_CONSULTA">💵 Fixo por Consulta</option>
              <option value="PERCENTUAL_RECEITA">📊 Percentual Receita</option>
              <option value="AMBOS">🔀 Ambos</option>
            </select>
          </div>

          {/* Valor Fixo */}
          <div>
            <label className="block text-sm font-medium mb-1">💵 Valor Fixo por Consulta (R$)</label>
            <input
              type="text"
              value={formData.valorFixo ? maskCurrency(formData.valorFixo) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, valorFixo: numValue })
              }}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>

          {/* Valor Consulta Particular */}
          <div>
            <label className="block text-sm font-medium mb-1">💳 Valor Consulta Particular (R$)</label>
            <input
              type="text"
              value={formData.valorConsultaParticular ? maskCurrency(formData.valorConsultaParticular) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, valorConsultaParticular: numValue })
              }}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>

          {/* Valor Consulta Plano */}
          <div>
            <label className="block text-sm font-medium mb-1">🏥 Valor Consulta Plano (R$)</label>
            <input
              type="text"
              value={formData.valorConsultaPlano ? maskCurrency(formData.valorConsultaPlano) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, valorConsultaPlano: numValue })
              }}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>

          {/* Desconto Clínica */}
          <div>
            <label className="block text-sm font-medium mb-1">🏪 Desconto Clínica (%)</label>
            <input
              type="text"
              value={formData.descontoClinicaPercentual ? maskPercentage(formData.descontoClinicaPercentual) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, descontoClinicaPercentual: numValue })
              }}
              placeholder="0,00"
              maxLength="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>

          {/* Ativo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo ?? true}
              onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
              className="h-4 w-4 rounded"
              disabled={isLoading}
            />
            <label htmlFor="ativo" className="text-sm font-medium">
              ✅ Profissional Ativo
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
        >
          {isLoading ? '⏳ Salvando...' : '💾 Salvar Profissional'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
        >
          ❌ Cancelar
        </button>
      </div>
    </form>
  )
}
