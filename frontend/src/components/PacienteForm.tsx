import React, { useState } from 'react'
import { Paciente } from '@/types'

/**
 * 📝 Props para o formulário de Paciente
 */
interface PacienteFormProps {
  initialData?: Paciente
  onSubmit: (data: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>
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
    if (!formData.telefone?.trim()) newErrors.telefone = 'Telefone é obrigatório'
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória'

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
      await onSubmit(formData as Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm'>)
    } catch (err) {
      console.error('Erro ao enviar formulário:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="md:col-span-2">
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
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm font-medium mb-1">CPF *</label>
          <input
            type="text"
            value={formData.cpf || ''}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cpf ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf}</span>}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium mb-1">Telefone *</label>
          <input
            type="tel"
            value={formData.telefone || ''}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.telefone ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.telefone && <span className="text-red-500 text-sm">{errors.telefone}</span>}
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm font-medium mb-1">Data de Nascimento *</label>
          <input
            type="date"
            value={formData.dataNascimento || ''}
            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dataNascimento ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.dataNascimento && (
            <span className="text-red-500 text-sm">{errors.dataNascimento}</span>
          )}
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
