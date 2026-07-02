/* 📋 Cores e tema da aplicação */
export const COLORS = {
  primary: '#0066cc',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#212529',
} as const

/* 📌 API Configuration */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    PROFISSIONAIS: '/profissionais',
    PACIENTES: '/pacientes',
    PLANOS_SAUDE: '/planos-saude',
    ATENDIMENTOS: '/atendimentos',
    PAGAMENTOS: '/pagamentos',
    RELATORIOS: '/relatorios',
  },
} as const

/* ⏰ Token Configuration */
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'alles_access_token',
  REFRESH_TOKEN_KEY: 'alles_refresh_token',
  USER_KEY: 'alles_user',
} as const

/* 👤 Perfis/Roles */
export const ROLES = {
  ADMIN: 'ADMIN',
  PROFISSIONAL: 'PROFISSIONAL',
  PACIENTE: 'PACIENTE',
  GERENTE: 'GERENTE',
} as const

/* 📊 Pagination */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const

/* ⏱️ Request Timeouts (em ms) */
export const TIMEOUTS = {
  SHORT: 3000,
  MEDIUM: 6000,
  LONG: 15000,
} as const
