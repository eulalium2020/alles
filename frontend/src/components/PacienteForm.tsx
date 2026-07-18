import React, { useState, useEffect } from 'react'
import { Paciente } from '@/types'
import { maskCPF, maskPhone, maskEmail } from '@/utils/inputMasks'

/**
 * 📝 Props para o formulário de Paciente
 */
interface PacienteFormProps {
  initialData?: Paciente
  onSubmit: (data: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm' | 'perfil'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

/**
 * 📝 Formulário para criar/editar paciente
 */
export const PacienteForm: React.FC<PacienteFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Paciente>>(
    initialData || {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      dataNascimento: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      alergias: '',
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

    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória'

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
        perfil: 'PACIENTE' as const,
      } as Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm' | 'perfil'>

      await onSubmit(payload)
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Erro ao salvar paciente'
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
            <label className="block text-sm font-medium mb-1">
              👤 Nome Completo *
            </label>
            <input
              type="text"
              value={formData.nome || ''}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              onBlur={() => handleBlur('nome')}
              placeholder="João Silva Santos"
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
              placeholder="seu@email.com"
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

          {/* Data de Nascimento */}
          <div>
            <label className="block text-sm font-medium mb-1">🎂 Data de Nascimento *</label>
            <input
              type="date"
              value={formData.dataNascimento || ''}
              onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              onBlur={() => handleBlur('dataNascimento')}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.dataNascimento && touched.dataNascimento
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.dataNascimento && touched.dataNascimento && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.dataNascimento}</span>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Endereço */}
      <div className="space-y-4 p-4 bg-white rounded-lg border-l-4 border-purple-500">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            2
          </span>
          Endereço (Opcional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Endereço */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">🏠 Rua/Avenida</label>
            <input
              type="text"
              value={formData.endereco || ''}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Rua das Flores"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          {/* Número */}
          <div>
            <label className="block text-sm font-medium mb-1">📍 Número</label>
            <input
              type="text"
              value={formData.numero || ''}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          {/* Complemento */}
          <div>
            <label className="block text-sm font-medium mb-1">📌 Complemento</label>
            <input
              type="text"
              value={formData.complemento || ''}
              onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
              placeholder="Apt 101"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-medium mb-1">🏘️ Bairro</label>
            <input
              type="text"
              value={formData.bairro || ''}
              onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              placeholder="Centro"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium mb-1">🏙️ Cidade</label>
            <input
              type="text"
              value={formData.cidade || ''}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              placeholder="São Paulo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium mb-1">🗺️ UF</label>
            <input
              type="text"
              value={formData.estado || ''}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
              placeholder="SP"
              maxLength="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          {/* CEP */}
          <div>
            <label className="block text-sm font-medium mb-1">📮 CEP</label>
            <input
              type="text"
              value={formData.cep || ''}
              onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
              placeholder="00000-000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Seção 3: Informações Médicas */}
      <div className="space-y-4 p-4 bg-white rounded-lg border-l-4 border-green-500">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            3
          </span>
          Informações Médicas (Opcional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Alergias */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">⚠️ Alergias</label>
            <textarea
              value={formData.alergias || ''}
              onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
              placeholder="Descreva alergias conhecidas..."
              rows={3}
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
              ✅ Paciente Ativo
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
          {isLoading ? '⏳ Salvando...' : '💾 Salvar Paciente'}
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
