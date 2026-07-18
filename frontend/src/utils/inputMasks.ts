/**
 * 🎭 Utilitários de Máscaras para Inputs
 * Formata valores de entrada em padrão brasileiro
 */

/**
 * Máscara para CPF: XXX.XXX.XXX-XX
 */
export const maskCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2')
}

/**
 * Máscara para Telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const maskPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  const length = cleaned.length

  if (length <= 2) return cleaned
  if (length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  if (length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }

  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
}

/**
 * Máscara para Email (simples validação)
 * Remove caracteres inválidos
 */
export const maskEmail = (value: string): string => {
  return value.toLowerCase().trim()
}

/**
 * Máscara para Valor Monetário: R$ 1.234,56
 */
export const maskCurrency = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) / 100 : value

  if (isNaN(numValue)) return ''

  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Máscara para Percentual: 99,99%
 */
export const maskPercentage = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numValue)) return ''

  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Máscara para CRM/Órgão de Classe: XXXXXX/UF
 * Exemplo: 123456/SP
 */
export const maskCRM = (value: string): string => {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '')

  if (cleaned.length <= 6) return cleaned
  return `${cleaned.slice(0, 6)}/${cleaned.slice(6, 8)}`
}

/**
 * Remove máscara para enviar ao servidor
 */
export const unmaskValue = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Remove máscara de CPF
 */
export const unmaskCPF = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Remove máscara de telefone
 */
export const unmaskPhone = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Remove máscara de CRM
 */
export const unmaskCRM = (value: string): string => {
  return value.replace(/[^A-Z0-9]/g, '')
}

/**
 * Remove máscara de valor monetário (mantém apenas números)
 */
export const unmaskCurrency = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Objeto com todas as máscaras agrupadas
 */
export const InputMasks = {
  cpf: maskCPF,
  phone: maskPhone,
  email: maskEmail,
  currency: maskCurrency,
  percentage: maskPercentage,
  crm: maskCRM,
}

/**
 * Objeto com funções de remoção de máscaras
 */
export const UnmaskFunctions = {
  cpf: unmaskCPF,
  phone: unmaskPhone,
  crm: unmaskCRM,
  currency: unmaskCurrency,
}
