import React, { useState } from 'react'
import { Profissional } from '@/types'
import { maskCPF, maskPhone, maskEmail, maskCRM, maskCurrency, maskPercentage } from '@/utils/inputMasks'
import { commonStyles, themeUtils } from '@/styles/theme'

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
    <form onSubmit={handleSubmit} style={commonStyles.formContainer}>
      {/* Erro de Submissão */}
      {submitError && (
        <div style={{ ...commonStyles.alertBanner, ...commonStyles.alertError }}>
          <span style={{ fontSize: '1.5rem' }}>❌</span>
          <div>
            <p style={{ fontWeight: '600', margin: 0 }}>Erro ao salvar</p>
            <p style={{ fontSize: '0.85rem', marginTop: 'var(--spacing-xs)' }}>{submitError}</p>
          </div>
        </div>
      )}

      {/* Seção 1: Dados Pessoais */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--primary-blue)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            1
          </span>
          Dados Pessoais
        </h3>

        <div style={commonStyles.formGrid}>
          {/* Nome */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={commonStyles.label}>👤 Nome Completo *</label>
            <input
              type="text"
              value={formData.nome || ''}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              onBlur={() => handleBlur('nome')}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => !errors.nome && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="Dr. João Silva"
              style={{
                ...commonStyles.input,
                borderColor: errors.nome && touched.nome ? 'var(--error-red)' : 'var(--border-color)',
              }}
              disabled={isLoading}
            />
            {errors.nome && touched.nome && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>⚠️ {errors.nome}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label style={commonStyles.label}>📧 Email *</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: maskEmail(e.target.value) })}
              onBlur={() => handleBlur('email')}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => !errors.email && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="dr@email.com"
              style={{
                ...commonStyles.input,
                borderColor: errors.email && touched.email ? 'var(--error-red)' : 'var(--border-color)',
              }}
              disabled={isLoading}
            />
            {errors.email && touched.email && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>⚠️ {errors.email}</span>
            )}
          </div>

          {/* CPF */}
          <div>
            <label style={commonStyles.label}>🆔 CPF *</label>
            <input
              type="text"
              value={formData.cpf || ''}
              onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
              onBlur={() => handleBlur('cpf')}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => !errors.cpf && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="000.000.000-00"
              maxLength="14"
              style={{
                ...commonStyles.input,
                borderColor: errors.cpf && touched.cpf ? 'var(--error-red)' : 'var(--border-color)',
              }}
              disabled={isLoading}
            />
            {errors.cpf && touched.cpf && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>⚠️ {errors.cpf}</span>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label style={commonStyles.label}>📱 Telefone *</label>
            <input
              type="tel"
              value={formData.telefone || ''}
              onChange={(e) => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
              onBlur={() => handleBlur('telefone')}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => !errors.telefone && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="(11) 99999-9999"
              maxLength="15"
              style={{
                ...commonStyles.input,
                borderColor: errors.telefone && touched.telefone ? 'var(--error-red)' : 'var(--border-color)',
              }}
              disabled={isLoading}
            />
            {errors.telefone && touched.telefone && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>⚠️ {errors.telefone}</span>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Informações Profissionais */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--secondary-teal)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--secondary-teal)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            2
          </span>
          Informações Profissionais
        </h3>

        <div style={commonStyles.formGrid}>
          {/* Órgão de Classe */}
          <div>
            <label style={commonStyles.label}>📜 Órgão de Classe *</label>
            <input
              type="text"
              value={formData.crm || ''}
              onChange={(e) => setFormData({ ...formData, crm: maskCRM(e.target.value) })}
              onBlur={() => handleBlur('crm')}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => !errors.crm && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="123456/SP"
              maxLength="9"
              style={{
                ...commonStyles.input,
                borderColor: errors.crm && touched.crm ? 'var(--error-red)' : 'var(--border-color)',
              }}
              disabled={isLoading}
            />
            {errors.crm && touched.crm && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>⚠️ {errors.crm}</span>
            )}
          </div>

          {/* Especialidade */}
          <div>
            <label style={commonStyles.label}>🏥 Especialidade *</label>
            <input
              type="text"
              value={formData.especialidade || ''}
              onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
              onBlur={() => handleBlur('especialidade')}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => !errors.especialidade && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="Ex: Cardiologia"
              style={{
                ...commonStyles.input,
                borderColor: errors.especialidade && touched.especialidade ? 'var(--error-red)' : 'var(--border-color)',
              }}
              disabled={isLoading}
            />
            {errors.especialidade && touched.especialidade && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>⚠️ {errors.especialidade}</span>
            )}
          </div>

          {/* Horários Atendimento */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={commonStyles.label}>⏰ Horários de Atendimento</label>
            <input
              type="text"
              value={formData.horariosAtendimento || ''}
              onChange={(e) => setFormData({ ...formData, horariosAtendimento: e.target.value })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="Seg-Sex 08:00-18:00, Sab 09:00-13:00"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Seção 3: Informações Financeiras */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--success-green)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--success-green)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            3
          </span>
          Informações Financeiras
        </h3>

        <div style={commonStyles.formGrid}>
          {/* Tipo de Pagamento */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={commonStyles.label}>💰 Tipo de Pagamento</label>
            <select
              value={formData.tipoPagamento || 'FIXO_POR_CONSULTA'}
              onChange={(e) => setFormData({ ...formData, tipoPagamento: e.target.value as any })}
              style={commonStyles.input}
              disabled={isLoading}
            >
              <option value="FIXO_POR_CONSULTA">💵 Fixo por Consulta</option>
              <option value="PERCENTUAL_RECEITA">📊 Percentual Receita</option>
              <option value="AMBOS">🔀 Ambos</option>
            </select>
          </div>

          {/* Valor Fixo */}
          <div>
            <label style={commonStyles.label}>💵 Valor Fixo por Consulta (R$)</label>
            <input
              type="text"
              value={formData.valorFixo ? maskCurrency(formData.valorFixo) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, valorFixo: numValue })
              }}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="R$ 0,00"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Valor Consulta Particular */}
          <div>
            <label style={commonStyles.label}>💳 Valor Consulta Particular (R$)</label>
            <input
              type="text"
              value={formData.valorConsultaParticular ? maskCurrency(formData.valorConsultaParticular) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, valorConsultaParticular: numValue })
              }}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="R$ 0,00"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Valor Consulta Plano */}
          <div>
            <label style={commonStyles.label}>🏥 Valor Consulta Plano (R$)</label>
            <input
              type="text"
              value={formData.valorConsultaPlano ? maskCurrency(formData.valorConsultaPlano) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, valorConsultaPlano: numValue })
              }}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="R$ 0,00"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Percentual Receita */}
          <div>
            <label style={commonStyles.label}>📊 Percentual Receita (%)</label>
            <input
              type="text"
              value={formData.percentualReceita ? maskPercentage(formData.percentualReceita) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, percentualReceita: numValue })
              }}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="0,00"
              maxLength="6"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Desconto Clínica */}
          <div>
            <label style={commonStyles.label}>🏪 Desconto Clínica (%)</label>
            <input
              type="text"
              value={formData.descontoClinicaPercentual ? maskPercentage(formData.descontoClinicaPercentual) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '')
                const numValue = cleaned ? parseFloat(cleaned) / 100 : 0
                setFormData({ ...formData, descontoClinicaPercentual: numValue })
              }}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="0,00"
              maxLength="6"
              style={commonStyles.input}
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
            <label htmlFor="ativo" style={commonStyles.label}>
              ✅ Profissional Ativo
            </label>
          </div>
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
          {isLoading ? '⏳ Salvando...' : '💾 Salvar Profissional'}
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
