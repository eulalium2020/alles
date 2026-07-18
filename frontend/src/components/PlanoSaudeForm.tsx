import React, { useState } from 'react'
import { PlanoSaude } from '@/types'
import { maskPhone } from '@/utils/inputMasks'
import { commonStyles, themeUtils } from '@/styles/theme'

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
    <form onSubmit={handleSubmit} style={commonStyles.formContainer}>
      <div style={commonStyles.formGrid}>
        {/* Nome */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={commonStyles.label}>🏥 Nome do Plano *</label>
          <input
            type="text"
            value={formData.nome || ''}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
            onMouseLeave={(e) => !errors.nome && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
            placeholder="Ex: Plano de Saúde Premium"
            style={{
              ...commonStyles.input,
              borderColor: errors.nome ? 'var(--error-red)' : 'var(--border-color)',
            }}
            disabled={isLoading}
          />
          {errors.nome && <span style={commonStyles.errorMessage}>{errors.nome}</span>}
        </div>

        {/* Operadora */}
        <div>
          <label style={commonStyles.label}>🏢 Operadora *</label>
          <input
            type="text"
            value={formData.operadora || ''}
            onChange={(e) => setFormData({ ...formData, operadora: e.target.value })}
            onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
            onMouseLeave={(e) => !errors.operadora && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
            placeholder="Ex: Amil, Bradesco Saúde"
            style={{
              ...commonStyles.input,
              borderColor: errors.operadora ? 'var(--error-red)' : 'var(--border-color)',
            }}
            disabled={isLoading}
          />
          {errors.operadora && <span style={commonStyles.errorMessage}>{errors.operadora}</span>}
        </div>

        {/* Número */}
        <div>
          <label style={commonStyles.label}>📋 Número do Plano *</label>
          <input
            type="text"
            value={formData.numero || ''}
            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
            onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
            onMouseLeave={(e) => !errors.numero && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
            placeholder="Ex: 123456789"
            style={{
              ...commonStyles.input,
              borderColor: errors.numero ? 'var(--error-red)' : 'var(--border-color)',
            }}
            disabled={isLoading}
          />
          {errors.numero && <span style={commonStyles.errorMessage}>{errors.numero}</span>}
        </div>

        {/* Validade */}
        <div>
          <label style={commonStyles.label}>📅 Data de Validade</label>
          <input
            type="date"
            value={formData.validade || ''}
            onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
            onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
            onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
            style={commonStyles.input}
            disabled={isLoading}
          />
        </div>

        {/* Descrição */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={commonStyles.label}>📝 Descrição</label>
          <textarea
            value={formData.descricao || ''}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            onFocus={(e) => themeUtils.applyInputFocus(e.target as any)}
            onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as any)}
            placeholder="Adicione detalhes sobre o plano..."
            rows={3}
            style={commonStyles.textarea}
            disabled={isLoading}
          />
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
            ✅ Ativo
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
