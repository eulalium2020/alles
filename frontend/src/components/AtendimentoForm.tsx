import React, { useState } from 'react'
import { Atendimento } from '@/types'

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
 * 📝 Formulário para agendar/editar atendimento com validação visual
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
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  /**
   * Validar formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.profissionalId) newErrors.profissionalId = 'Profissional é obrigatório'
    if (!formData.pacienteId) newErrors.pacienteId = 'Paciente é obrigatório'
    if (!formData.dataHora) newErrors.dataHora = 'Data e hora são obrigatórias'

    // Validação adicional: data não pode ser no passado
    if (formData.dataHora) {
      const selectedDate = new Date(formData.dataHora)
      if (selectedDate < new Date()) {
        newErrors.dataHora = 'Data/hora deve ser no futuro'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
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

  const getFieldStatus = (fieldName: string) => {
    if (!touched[fieldName]) return null
    if (errors[fieldName]) return 'error'
    return 'success'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
      {/* Título */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? '✏️ Editar Atendimento' : '📅 Novo Agendamento'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">Preencha os dados abaixo para continuar</p>
      </div>

      {/* Seção 1: Participantes */}
      <div className="space-y-4 p-4 bg-white rounded-lg border-l-4 border-blue-500">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          Selecione Profissional e Paciente
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profissional ID */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              👨‍⚕️ Profissional <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.profissionalId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, profissionalId: parseInt(e.target.value) || 0 })
                }
                onBlur={() => handleBlur('profissionalId')}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  getFieldStatus('profissionalId') === 'error'
                    ? 'border-red-500 focus:ring-red-500'
                    : getFieldStatus('profissionalId') === 'success'
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={isLoading}
                placeholder="ID do profissional"
              />
              {getFieldStatus('profissionalId') === 'success' && (
                <span className="absolute right-3 top-2 text-2xl">✓</span>
              )}
              {getFieldStatus('profissionalId') === 'error' && (
                <span className="absolute right-3 top-2 text-2xl">⚠️</span>
              )}
            </div>
            {errors.profissionalId && touched.profissionalId && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {errors.profissionalId}
              </span>
            )}
          </div>

          {/* Paciente ID */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              👤 Paciente <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.pacienteId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, pacienteId: parseInt(e.target.value) || 0 })
                }
                onBlur={() => handleBlur('pacienteId')}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  getFieldStatus('pacienteId') === 'error'
                    ? 'border-red-500 focus:ring-red-500'
                    : getFieldStatus('pacienteId') === 'success'
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={isLoading}
                placeholder="ID do paciente"
              />
              {getFieldStatus('pacienteId') === 'success' && (
                <span className="absolute right-3 top-2 text-2xl">✓</span>
              )}
              {getFieldStatus('pacienteId') === 'error' && (
                <span className="absolute right-3 top-2 text-2xl">⚠️</span>
              )}
            </div>
            {errors.pacienteId && touched.pacienteId && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {errors.pacienteId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Data/Hora e Tipo */}
      <div className="space-y-4 p-4 bg-white rounded-lg border-l-4 border-purple-500">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            2
          </span>
          Definir Data, Hora e Tipo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data/Hora */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              📅 Data e Hora <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={formData.dataHora || ''}
                onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                onBlur={() => handleBlur('dataHora')}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  getFieldStatus('dataHora') === 'error'
                    ? 'border-red-500 focus:ring-red-500'
                    : getFieldStatus('dataHora') === 'success'
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={isLoading}
              />
              {getFieldStatus('dataHora') === 'success' && (
                <span className="absolute right-3 top-2 text-2xl">✓</span>
              )}
              {getFieldStatus('dataHora') === 'error' && (
                <span className="absolute right-3 top-2 text-2xl">⚠️</span>
              )}
            </div>
            {errors.dataHora && touched.dataHora && (
              <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {errors.dataHora}
              </span>
            )}
            {!errors.dataHora && touched.dataHora && (
              <span className="text-green-600 text-sm mt-1 flex items-center gap-1">
                ✓ Data/hora válida
              </span>
            )}
          </div>

          {/* Tipo de Atendimento */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              🏥 Tipo de Atendimento
            </label>
            <select
              value={formData.tipoAtendimento || 'PRESENCIAL'}
              onChange={(e) =>
                setFormData({ ...formData, tipoAtendimento: e.target.value as any })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              disabled={isLoading}
            >
              <option value="PRESENCIAL">🏥 Presencial</option>
              <option value="TELEMEDICINA">📱 Telemedicina</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seção 3: Status e Anotações */}
      <div className="space-y-4 p-4 bg-white rounded-lg border-l-4 border-green-500">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            3
          </span>
          Status e Anotações
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              📊 Status
            </label>
            <select
              value={formData.status || 'AGENDADO'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              disabled={isLoading}
            >
              <option value="AGENDADO">📅 Agendado</option>
              <option value="REALIZADO">✅ Realizado</option>
              <option value="CANCELADO">❌ Cancelado</option>
              <option value="NAO_COMPARECEU">⚠️ Não Compareceu</option>
            </select>
          </div>
        </div>

        {/* Anotações */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            📝 Anotações (Opcional)
          </label>
          <textarea
            value={formData.anotacoes || ''}
            onChange={(e) => setFormData({ ...formData, anotacoes: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            rows={3}
            disabled={isLoading}
            placeholder="Adicione anotações sobre o atendimento..."
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <span className="text-xl">ℹ️</span>
          <p className="text-sm text-blue-700">
            <strong>Dica:</strong> Preencha os dados do paciente e profissional. O sistema validará
            disponibilidade automaticamente.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
        >
          {isLoading ? '⏳ Salvando...' : initialData ? '💾 Atualizar Agendamento' : '✅ Agendar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
