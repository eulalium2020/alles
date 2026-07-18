import React, { useState, useEffect } from 'react'
import { Paciente } from '@/types'
import { maskCPF, maskPhone, maskEmail } from '@/utils/inputMasks'
import { commonStyles, themeUtils } from '@/styles/theme'
import { usePlanosNomes } from '@/hooks/useNomes'

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
  const [formData, setFormData] = useState<Partial<Paciente & { planosSaudeNomes?: string[] }>>(
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
      planosSaudeNomes: [],
      ativo: true,
    },
  )

  const { items: planosList, loading: loadingPlanos, error: erroPlanos } = usePlanosNomes()

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
      // Converter nomes para IDs
      const planosSaudeIds: number[] = (formData.planosSaudeNomes || [])
        .map((nome) => planosList.find((p) => p.nome === nome)?.id)
        .filter((id): id is number => id !== undefined)

      const payload = {
        ...formData,
        planosSaudeIds,
        planosSaudeNomes: undefined,
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

  /**
   * Effect: Preencher planos de saúde ao editar
   */
  useEffect(() => {
    if (initialData && planosList.length > 0 && (initialData as any).planosSaudeIds) {
      const planoIds = (initialData as any).planosSaudeIds as number[]
      const planoNomes = planoIds
        .map((id) => planosList.find((p) => p.id === id)?.nome)
        .filter((nome): nome is string => nome !== undefined)

      if (planoNomes.length > 0) {
        setFormData((prev) => ({
          ...prev,
          planosSaudeNomes: planoNomes,
        }))
      }
    }
  }, [initialData, planosList])

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
            <label style={commonStyles.label}>
              👤 Nome Completo *
            </label>
            <input
              type="text"
              value={formData.nome || ''}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              onBlur={() => handleBlur('nome')}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => !errors.nome && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="João Silva Santos"
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
              placeholder="seu@email.com"
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

          {/* Data de Nascimento */}
          <div>
            <label style={commonStyles.label}>🎂 Data de Nascimento *</label>
            <input
              type="date"
              value={formData.dataNascimento || ''}
              onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              onBlur={() => handleBlur('dataNascimento')}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => !errors.dataNascimento && themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              style={{
                ...commonStyles.input,
                borderColor: errors.dataNascimento && touched.dataNascimento ? 'var(--error-red)' : 'var(--border-color)',
              }}
              disabled={isLoading}
            />
            {errors.dataNascimento && touched.dataNascimento && (
              <span style={{ ...commonStyles.errorMessage, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>⚠️ {errors.dataNascimento}</span>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Endereço */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--secondary-teal)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--secondary-teal)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            2
          </span>
          Endereço (Opcional)
        </h3>

        <div style={commonStyles.formGrid}>
          {/* Endereço */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={commonStyles.label}>🏠 Rua/Avenida</label>
            <input
              type="text"
              value={formData.endereco || ''}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="Rua das Flores"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Número */}
          <div>
            <label style={commonStyles.label}>📍 Número</label>
            <input
              type="text"
              value={formData.numero || ''}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="123"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Complemento */}
          <div>
            <label style={commonStyles.label}>📌 Complemento</label>
            <input
              type="text"
              value={formData.complemento || ''}
              onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="Apt 101"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Bairro */}
          <div>
            <label style={commonStyles.label}>🏘️ Bairro</label>
            <input
              type="text"
              value={formData.bairro || ''}
              onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="Centro"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Cidade */}
          <div>
            <label style={commonStyles.label}>🏙️ Cidade</label>
            <input
              type="text"
              value={formData.cidade || ''}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="São Paulo"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* Estado */}
          <div>
            <label style={commonStyles.label}>🗺️ UF</label>
            <input
              type="text"
              value={formData.estado || ''}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="SP"
              maxLength="2"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>

          {/* CEP */}
          <div>
            <label style={commonStyles.label}>📮 CEP</label>
            <input
              type="text"
              value={formData.cep || ''}
              onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as HTMLInputElement)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as HTMLInputElement)}
              placeholder="00000-000"
              style={commonStyles.input}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Seção 3: Planos de Saúde */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--secondary-teal)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--secondary-teal)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            3
          </span>
          Planos de Saúde (Opcional)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {erroPlanos ? (
            <p style={{ color: 'var(--error-red)', fontSize: '0.85rem' }}>⚠️ Erro ao carregar planos de saúde</p>
          ) : loadingPlanos ? (
            <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }}>⏳ Carregando planos...</p>
          ) : planosList.length === 0 ? (
            <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }}>Nenhum plano disponível</p>
          ) : (
            planosList.map((plano) => (
              <div key={plano.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <input
                  type="checkbox"
                  id={`plano-${plano.id}`}
                  checked={(formData.planosSaudeNomes || []).includes(plano.nome)}
                  onChange={(e) => {
                    const newPlanos = e.target.checked
                      ? [...(formData.planosSaudeNomes || []), plano.nome]
                      : (formData.planosSaudeNomes || []).filter((p) => p !== plano.nome)
                    setFormData({ ...formData, planosSaudeNomes: newPlanos })
                  }}
                  style={{ width: '1rem', height: '1rem', borderRadius: 'var(--radius-xs)' }}
                  disabled={isLoading}
                />
                <label htmlFor={`plano-${plano.id}`} style={{ ...commonStyles.label, margin: 0, cursor: 'pointer' }}>
                  💳 {plano.nome}
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Seção 4: Informações Médicas */}
      <div style={{ ...commonStyles.formSection, padding: 'var(--spacing-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--success-green)' }}>
        <h3 style={commonStyles.formSectionTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--success-green)', color: 'var(--white)', fontSize: '0.75rem', marginRight: 'var(--spacing-sm)' }}>
            4
          </span>
          Informações Médicas (Opcional)
        </h3>

        <div style={commonStyles.formGrid}>
          {/* Alergias */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={commonStyles.label}>⚠️ Alergias</label>
            <textarea
              value={formData.alergias || ''}
              onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
              onFocus={(e) => themeUtils.applyInputFocus(e.target as any)}
              onMouseLeave={(e) => themeUtils.resetInputFocus(e.target as any)}
              placeholder="Descreva alergias conhecidas..."
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
            <label htmlFor="ativo" style={commonStyles.label}>
              ✅ Paciente Ativo
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
          {isLoading ? '⏳ Salvando...' : '💾 Salvar Paciente'}
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
