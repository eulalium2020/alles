import React, { useState } from 'react'
import { Especialidade } from '@/types'
import { commonStyles, themeUtils } from '@/styles/theme'

/**
 * 📝 Props para o formulário de Especialidade
 */
interface EspecialidadeFormProps {
  initialData?: Especialidade
  onSubmit: (data: Omit<Especialidade, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

/**
 * 📝 Formulário para criar/editar especialidade
 */
export const EspecialidadeForm: React.FC<EspecialidadeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Especialidade>>(
    initialData || {
      nome: '',
      descricao: '',
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
    if (!formData.descricao?.trim()) newErrors.descricao = 'Descrição é obrigatória'

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
      await onSubmit(formData as Omit<Especialidade, 'id'>)
    } catch (err) {
      console.error('Erro ao enviar formulário:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={commonStyles.formContainer}>
      <div style={commonStyles.formGrid}>
        {/* Nome */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={commonStyles.label}>🏥 Nome da Especialidade *</label>
          <input
            type="text"
            value={formData.nome || ''}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
            onMouseLeave={(e) => !errors.nome && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
            placeholder="Ex: Cardiologia"
            style={{
              ...commonStyles.input,
              borderColor: errors.nome ? 'var(--error-red)' : 'var(--border-color)',
            }}
            disabled={isLoading}
          />
          {errors.nome && <span style={commonStyles.errorMessage}>{errors.nome}</span>}
        </div>

        {/* Descrição */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={commonStyles.label}>📝 Descrição *</label>
          <textarea
            value={formData.descricao || ''}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            onFocus={(e) => themeUtils.applyInputFocus(e.target as any)}
            onMouseLeave={(e) => !errors.descricao && themeUtils.resetInputFocus(e.target as any)}
            placeholder="Descreva a especialidade..."
            rows={4}
            style={{
              ...commonStyles.textarea,
              borderColor: errors.descricao ? 'var(--error-red)' : 'var(--border-color)',
            }}
            disabled={isLoading}
          />
          {errors.descricao && <span style={commonStyles.errorMessage}>{errors.descricao}</span>}
        </div>

        {/* Ativo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <input
            type="checkbox"
            id="ativo"
            checked={formData.ativo ?? true}
            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
            style={{ width: '1rem', height: '1rem', borderRadius: 'var(--radius-xs)' }}
            disabled={isLoading}
          />
          <label htmlFor="ativo" style={{ ...commonStyles.label, marginBottom: 0 }}>
            ✅ Ativa
          </label>
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
          {isLoading ? '⏳ Salvando...' : '💾 Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{ ...commonStyles.button, backgroundColor: '#E0E0E0', color: 'var(--text-dark)', flex: 1, opacity: isLoading ? 0.6 : 1 }}
        >
          ❌ Cancelar
        </button>
      </div>
    </form>
  )
}
