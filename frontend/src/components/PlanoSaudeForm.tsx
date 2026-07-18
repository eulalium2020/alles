import React, { useState } from 'react'
import { PlanoSaude } from '@/types'
import { maskPhone } from '@/utils/inputMasks'

/**
 * 📝 Props para o formulário de Plano de Saúde
 */
interface PlanoSaudeFormProps {
  initialData?: PlanoSaude
  onSubmit: (data: Omit<PlanoSaude, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

/**
 * 📝 Formulário para criar/editar plano de saúde
 */
export const PlanoSaudeForm: React.FC<PlanoSaudeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<PlanoSaude>>(
    initialData || {
      nome: '',
      descricao: '',
      operadora: '',
      numero: '',
      validade: '',
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
    if (!formData.operadora?.trim()) newErrors.operadora = 'Operadora é obrigatória'
    if (!formData.numero?.trim()) newErrors.numero = 'Número é obrigatório'

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
      await onSubmit(formData as Omit<PlanoSaude, 'id'>)
    } catch (err) {
      console.error('Erro ao enviar formulário:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">🏥 Nome do Plano *</label>
          <input
            type="text"
            value={formData.nome || ''}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Plano de Saúde Premium"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.nome && <span className="text-red-500 text-sm">{errors.nome}</span>}
        </div>

        {/* Operadora */}
        <div>
          <label className="block text-sm font-medium mb-1">🏢 Operadora *</label>
          <input
            type="text"
            value={formData.operadora || ''}
            onChange={(e) => setFormData({ ...formData, operadora: e.target.value })}
            placeholder="Ex: Amil, Bradesco Saúde"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.operadora ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.operadora && <span className="text-red-500 text-sm">{errors.operadora}</span>}
        </div>

        {/* Número */}
        <div>
          <label className="block text-sm font-medium mb-1">📋 Número do Plano *</label>
          <input
            type="text"
            value={formData.numero || ''}
            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
            placeholder="Ex: 123456789"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.numero ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.numero && <span className="text-red-500 text-sm">{errors.numero}</span>}
        </div>

        {/* Validade */}
        <div>
          <label className="block text-sm font-medium mb-1">📅 Data de Validade</label>
          <input
            type="date"
            value={formData.validade || ''}
            onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">📝 Descrição</label>
          <textarea
            value={formData.descricao || ''}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Adicione detalhes sobre o plano..."
            rows={3}
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
            ✅ Ativo
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
          {isLoading ? '⏳ Salvando...' : '💾 Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
        >
          ❌ Cancelar
        </button>
      </div>
    </form>
  )
}
