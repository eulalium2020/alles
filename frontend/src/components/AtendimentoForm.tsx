import React, { useState } from 'react'
import { Atendimento } from '@/types'
import { commonStyles, themeUtils } from '@/styles/theme'
import { useProfissionaisNomes, usePacientesNomes } from '@/hooks/useNomes'

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
  const [formData, setFormData] = useState<Partial<Atendimento & { profissionalNome?: string; pacienteNome?: string }>>(
    initialData || {
      profissionalNome: '',
      pacienteNome: '',
      dataHora: '',
      tipoAtendimento: 'PRESENCIAL',
      status: 'AGENDADO',
      anotacoes: '',
    },
  )

  const { items: profissionaisList, loading: loadingProfissionais, error: erroProfissionais } = useProfissionaisNomes()
  const { items: pacientesList, loading: loadingPacientes, error: erroPacientes } = usePacientesNomes()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  /**
   * Validar formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.profissionalNome) newErrors.profissionalNome = 'Profissional é obrigatório'
    if (!formData.pacienteNome) newErrors.pacienteNome = 'Paciente é obrigatório'
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
      // Converter nomes para IDs
      const profissional = profissionaisList.find((p) => p.display === formData.profissionalNome)
      const paciente = pacientesList.find((p) => p.display === formData.pacienteNome)

      if (!profissional || !paciente) {
        throw new Error('Profissional ou paciente não encontrado')
      }

      const dataToSubmit: Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'> = {
        profissionalId: profissional.id,
        pacienteId: paciente.id,
        dataHora: formData.dataHora || '',
        tipoAtendimento: formData.tipoAtendimento || 'PRESENCIAL',
        status: formData.status || 'AGENDADO',
        anotacoes: formData.anotacoes || '',
      }

      await onSubmit(dataToSubmit)
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
    <form onSubmit={handleSubmit} style={commonStyles.formContainer}>
      {/* Título */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--spacing-lg)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: 0 }}>
          {initialData ? '✏️ Editar Atendimento' : '📅 Novo Agendamento'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: 'var(--spacing-xs)' }}>Preencha os dados abaixo para continuar</p>
      </div>

      {/* Seção 1: Participantes */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--primary-blue)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            1
          </span>
          Selecione Profissional e Paciente
        </h3>

        <div style={commonStyles.formGrid}>
          {/* Profissional Name Select */}
          <div>
            <label style={commonStyles.label}>
              👨‍⚕️ Profissional <span style={{ color: 'var(--error-red)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={formData.profissionalNome || ''}
                onChange={(e) => setFormData({ ...formData, profissionalNome: e.target.value })}
                onBlur={() => handleBlur('profissionalNome')}
                onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLSelectElement)}
                onMouseLeave={(e) => !errors.profissionalNome && themeUtils.resetInputFocus(e.target as HTMLSelectElement)}
                style={{
                  ...commonStyles.input,
                  borderColor:
                    getFieldStatus('profissionalNome') === 'error'
                      ? 'var(--error-red)'
                      : getFieldStatus('profissionalNome') === 'success'
                        ? 'var(--success-green)'
                        : 'var(--border-color)',
                }}
                disabled={isLoading || loadingProfissionais}
              >
                <option value="">-- Selecione um profissional --</option>
                {erroProfissionais && (
                  <option value="">⚠️ Erro ao carregar profissionais</option>
                )}
                {profissionaisList.map((p) => (
                  <option key={p.id} value={p.display}>
                    {p.display}
                  </option>
                ))}
              </select>
              {getFieldStatus('profissionalNome') === 'success' && (
                <span style={{ position: 'absolute', right: 'var(--spacing-md)', top: 'var(--spacing-sm)', fontSize: '1.25rem' }}>
                  ✓
                </span>
              )}
              {getFieldStatus('profissionalNome') === 'error' && (
                <span style={{ position: 'absolute', right: 'var(--spacing-md)', top: 'var(--spacing-sm)', fontSize: '1.25rem' }}>
                  ⚠️
                </span>
              )}
            </div>
            {errors.profissionalNome && touched.profissionalNome && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                ⚠️ {errors.profissionalNome}
              </span>
            )}
          </div>

          {/* Paciente Name Select */}
          <div>
            <label style={commonStyles.label}>
              👤 Paciente <span style={{ color: 'var(--error-red)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={formData.pacienteNome || ''}
                onChange={(e) => setFormData({ ...formData, pacienteNome: e.target.value })}
                onBlur={() => handleBlur('pacienteNome')}
                onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLSelectElement)}
                onMouseLeave={(e) => !errors.pacienteNome && themeUtils.resetInputFocus(e.target as HTMLSelectElement)}
                style={{
                  ...commonStyles.input,
                  borderColor:
                    getFieldStatus('pacienteNome') === 'error'
                      ? 'var(--error-red)'
                      : getFieldStatus('pacienteNome') === 'success'
                        ? 'var(--success-green)'
                        : 'var(--border-color)',
                }}
                disabled={isLoading || loadingPacientes}
              >
                <option value="">-- Selecione um paciente --</option>
                {erroPacientes && (
                  <option value="">⚠️ Erro ao carregar pacientes</option>
                )}
                {pacientesList.map((p) => (
                  <option key={p.id} value={p.display}>
                    {p.display}
                  </option>
                ))}
              </select>
              {getFieldStatus('pacienteNome') === 'success' && (
                <span style={{ position: 'absolute', right: 'var(--spacing-md)', top: 'var(--spacing-sm)', fontSize: '1.25rem' }}>
                  ✓
                </span>
              )}
              {getFieldStatus('pacienteNome') === 'error' && (
                <span style={{ position: 'absolute', right: 'var(--spacing-md)', top: 'var(--spacing-sm)', fontSize: '1.25rem' }}>
                  ⚠️
                </span>
              )}
            </div>
            {errors.pacienteNome && touched.pacienteNome && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                ⚠️ {errors.pacienteNome}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Data/Hora e Tipo */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--secondary-teal)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--secondary-teal)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            2
          </span>
          Definir Data, Hora e Tipo
        </h3>

        <div style={commonStyles.formGrid}>
          {/* Data/Hora */}
          <div>
            <label style={commonStyles.label}>
              📅 Data e Hora <span style={{ color: 'var(--error-red)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="datetime-local"
                value={formData.dataHora || ''}
                onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                onBlur={() => handleBlur('dataHora')}
                onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
                onMouseLeave={(e) => !errors.dataHora && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
                style={{
                  ...commonStyles.input,
                  borderColor: getFieldStatus('dataHora') === 'error' ? 'var(--error-red)' : getFieldStatus('dataHora') === 'success' ? 'var(--success-green)' : 'var(--border-color)',
                }}
                disabled={isLoading}
              />
              {getFieldStatus('dataHora') === 'success' && (
                <span style={{ position: 'absolute', right: 'var(--spacing-md)', top: 'var(--spacing-sm)', fontSize: '1.25rem' }}>✓</span>
              )}
              {getFieldStatus('dataHora') === 'error' && (
                <span style={{ position: 'absolute', right: 'var(--spacing-md)', top: 'var(--spacing-sm)', fontSize: '1.25rem' }}>⚠️</span>
              )}
            </div>
            {errors.dataHora && touched.dataHora && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                ⚠️ {errors.dataHora}
              </span>
            )}
            {!errors.dataHora && touched.dataHora && (
              <span style={{ ...commonStyles.successMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                ✓ Data/hora válida
              </span>
            )}
          </div>

          {/* Tipo de Atendimento */}
          <div>
            <label style={commonStyles.label}>
              🏥 Tipo de Atendimento
            </label>
            <select
              value={formData.tipoAtendimento || 'PRESENCIAL'}
              onChange={(e) =>
                setFormData({ ...formData, tipoAtendimento: e.target.value as any })
              }
              style={commonStyles.input}
              disabled={isLoading}
            >
              <option value="PRESENCIAL">🏥 Presencial</option>
              <option value="TELEMEDICINA">📱 Telemedicina</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seção 3: Status e Anotações */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--success-green)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--success-green)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            3
          </span>
          Status e Anotações
        </h3>

        <div style={commonStyles.formGrid}>
          {/* Status */}
          <div>
            <label style={commonStyles.label}>
              📊 Status
            </label>
            <select
              value={formData.status || 'AGENDADO'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              style={commonStyles.input}
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
          <label style={commonStyles.label}>
            📝 Anotações (Opcional)
          </label>
          <textarea
            value={formData.anotacoes || ''}
            onChange={(e) => setFormData({ ...formData, anotacoes: e.target.value })}
            onFocus={(e) => themeUtils.applyInputFocus(e.target as any)}
            onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as any)}
            rows={3}
            style={commonStyles.textarea}
            disabled={isLoading}
            placeholder="Adicione anotações sobre o atendimento..."
          />
        </div>

        {/* Info */}
        <div style={{ ...commonStyles.alertBanner, backgroundColor: '#E3F2FD', borderLeftColor: 'var(--primary-blue)', color: '#0D47A1', borderLeft: '4px solid var(--primary-blue)' }}>
          <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            <strong>Dica:</strong> Preencha os dados do paciente e profissional. O sistema validará
            disponibilidade automaticamente.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div style={commonStyles.formActions}>
        <button
          type="submit"
          disabled={isLoading}
          onMouseEnter={(e) => !isLoading && themeUtils.applyPrimaryButtonHover(e.currentTarget)}
          onMouseLeave={(e) => !isLoading && themeUtils.resetPrimaryButton(e.currentTarget)}
          style={{ ...commonStyles.button, ...commonStyles.buttonPrimary, flex: 1 }}
        >
          {isLoading ? '⏳ Salvando...' : initialData ? '💾 Atualizar Agendamento' : '✅ Agendar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{ ...commonStyles.button, backgroundColor: '#E0E0E0', color: 'var(--text-dark)', flex: 1, opacity: isLoading ? 0.6 : 1 }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
