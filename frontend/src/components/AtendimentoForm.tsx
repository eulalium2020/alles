import React, { useState } from 'react'
import { Atendimento } from '@types/index'

/**
 * 📝 Props para o formulário de Atendimento
 */
interface AtendimentoFormProps {
  initialData?: Atendimento
  onSubmit: (data: Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

/**
 * 📝 Formulário para agendar/editar atendimento
 */
export const AtendimentoForm: React.FC<AtendimentoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Atendimento>>(
    initialData || {
      profissionalId: 0,
      pacienteId: 0,
      dataHora: '',
      tipoAtendimento: 'PRESENCIAL',
      status: 'AGENDADO',
      anotacoes: '',
    },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * Validar formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.profissionalId) newErrors.profissionalId = 'Profissional é obrigatório'
    if (!formData.pacienteId) newErrors.pacienteId = 'Paciente é obrigatório'
    if (!formData.dataHora) newErrors.dataHora = 'Data e hora são obrigatórias'

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
      await onSubmit(formData as Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'>)
    } catch (err) {
      console.error('Erro ao enviar formulário:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profissional ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Profissional *</label>
          <input
            type="number"
            value={formData.profissionalId || ''}
            onChange={(e) =>
              setFormData({ ...formData, profissionalId: parseInt(e.target.value) || 0 })
            }
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.profissionalId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.profissionalId && (
            <span className="text-red-500 text-sm">{errors.profissionalId}</span>
          )}
        </div>

        {/* Paciente ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Paciente *</label>
          <input
            type="number"
            value={formData.pacienteId || ''}
            onChange={(e) =>
              setFormData({ ...formData, pacienteId: parseInt(e.target.value) || 0 })
            }
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.pacienteId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.pacienteId && (
            <span className="text-red-500 text-sm">{errors.pacienteId}</span>
          )}
        </div>

        {/* Data/Hora */}
        <div>
          <label className="block text-sm font-medium mb-1">Data e Hora *</label>
          <input
            type="datetime-local"
            value={formData.dataHora || ''}
            onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dataHora ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.dataHora && <span className="text-red-500 text-sm">{errors.dataHora}</span>}
        </div>

        {/* Tipo de Atendimento */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={formData.tipoAtendimento || 'PRESENCIAL'}
            onChange={(e) =>
              setFormData({ ...formData, tipoAtendimento: e.target.value as any })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="PRESENCIAL">Presencial</option>
            <option value="TELEMEDICINA">Telemedicina</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status || 'AGENDADO'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="AGENDADO">Agendado</option>
            <option value="REALIZADO">Realizado</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="NAO_COMPARECEU">Não Compareceu</option>
          </select>
        </div>

        {/* Anotações */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Anotações</label>
          <textarea
            value={formData.anotacoes || ''}
            onChange={(e) => setFormData({ ...formData, anotacoes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          {isLoading ? 'Salvando...' : 'Agendar'}
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
