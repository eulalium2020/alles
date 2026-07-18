/* 👤 Tipos de Usuário */
export type Perfil = 'ADMIN' | 'PROFISSIONAL' | 'PACIENTE' | 'GERENTE'

export interface Usuario {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string
  perfil: Perfil
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  usuario: Usuario
}

export interface TokenPayload {
  email: string
  perfil: Perfil
  exp: number
}

/* 📋 DTOs de Nome-Based Selection */
export interface NomeResponse {
  id: number
  nome: string
  display: string // "Nome (CPF/CRM/etc)"
  crm?: string // Para profissionais
  cpf?: string // Para pacientes
  operadora?: string // Para planos de saúde
}

/* 👨‍⚕️ Profissional */
export type TipoPagamento = 'FIXO_POR_CONSULTA' | 'PERCENTUAL_RECEITA' | 'AMBOS'

export interface Especialidade {
  id: number
  nome: string
  descricao: string
  ativo: boolean
}

export interface Profissional extends Usuario {
  especialidade?: Especialidade | string // Pode ser objeto ou string (nome)
  crm?: string
  tipoPagamento?: TipoPagamento | string
  valorFixo?: number
  valorConsultaParticular?: number
  valorConsultaPlano?: number
  percentualReceita?: number
  descontoClinicaPercentual?: number
  horariosAtendimento?: string
}

/* 📋 DTOs e Payloads para Backend */
export interface ProfissionalPayload extends Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm' | 'perfil'> {
  nome: string
  email: string
  cpf: string
  telefone: string
  crm: string
  especialidadeId?: number // ID-based
  especialidade?: string // Name-based
  tipoPagamento: string
  valorFixo?: number
  valorConsultaParticular?: number
  valorConsultaPlano?: number
  percentualReceita?: number
  descontoClinicaPercentual?: number
  ativo?: boolean
}

/* 🏥 Paciente */
export interface PlanoSaude {
  id: number
  nome: string
  descricao?: string
  dataCriacao?: string
  operadora?: string
  numero?: string
  validade?: string
  ativo: boolean
}

export interface Paciente extends Usuario {
  dataNascimento: string
  cpf?: string
  telefone?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  alergias?: string
  planosSaude?: PlanoSaude[]
  historicoAtendimentos?: number
}

export interface PacientePayload extends Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm' | 'perfil'> {
  nome: string
  email: string
  cpf: string
  telefone: string
  dataNascimento: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  alergias?: string
  planosSaudeIds?: number[] // ID-based
  planosSaudeNomes?: string[] // Name-based
  ativo?: boolean
}

/* 📅 Atendimento */
export type TipoAtendimento = 'PRESENCIAL' | 'TELEMEDICINA'
export type StatusAtendimento = 'AGENDADO' | 'REALIZADO' | 'CANCELADO' | 'NAO_COMPARECEU'

export interface Atendimento {
  id: number
  profissionalId: number
  pacienteId: number
  dataHora: string
  tipoAtendimento: TipoAtendimento
  status: StatusAtendimento
  anotacoes?: string
  criadoEm: string
  atualizadoEm: string
}

export interface AtendimentoPayload extends Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'> {
  profissionalId?: number // ID-based
  pacienteId?: number // ID-based
  profissionalNome?: string // Name-based
  pacienteNome?: string // Name-based
}

export interface AtendimentoComDetalhes extends Atendimento {
  profissional: Profissional
  paciente: Paciente
  valor: number
}

/* 💰 Pagamento */
export type StatusPagamento = 'PENDENTE' | 'PROCESSANDO' | 'PAGO' | 'FALHOU'

export interface Pagamento {
  id: number
  profissionalId: number
  valor: number
  status: StatusPagamento
  referencia: string // YYYY-MM
  dataVencimento: string
  dataPagamento?: string
  criadoEm: string
}

export interface PagamentoComDetalhes extends Pagamento {
  atendimentos: Atendimento[]
  profissional: Profissional
}

/* 📊 Relatório */
export interface RelatorioMensal {
  profissional_id: number
  profissional_nome: string
  mes: string
  total_atendimentos: number
  atendimentos_realizados: number
  receita: number
  pagamento: number
  desconto_clinica: number
  tipo_pagamento: string
}

export interface DashboardStats {
  totalProfissionais: number
  totalPacientes: number
  atendimentosMes: number
  receitaMes: number
}

/* 🔍 Filtros e Paginação */
export interface PaginationParams {
  page: number
  pageSize: number
  sort?: string
  direction?: 'ASC' | 'DESC'
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  isLast: boolean
}

/* ❌ Errors */
export interface ApiError {
  status: number
  message: string
  timestamp: string
  path: string
  fieldErrors?: Record<string, string>
}

export class HttpException extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: ApiError,
  ) {
    super(message)
  }
}
