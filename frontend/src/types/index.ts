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
  password: string
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

/* 👨‍⚕️ Profissional */
export type TipoPagamento = 'FIXO_POR_CONSULTA' | 'PERCENTUAL_RECEITA' | 'AMBOS'

export interface Especialidade {
  id: number
  nome: string
  descricao: string
  ativo: boolean
}

export interface Profissional extends Usuario {
  especialidade: Especialidade
  crm: string
  tipoPagamento: TipoPagamento
  valorFixo?: number
  percentualReceita?: number
  horariosAtendimento: string
}

/* 🏥 Paciente */
export interface PlanoSaude {
  id: number
  nome: string
  operadora: string
  numero: string
  validade: string
  ativo: boolean
}

export interface Paciente extends Usuario {
  dataNascimento: string
  planosSaude: PlanoSaude[]
  historicoAtendimentos: number
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
  profissionalId: number
  profissional: Profissional
  mes: string
  totalAtendimentos: number
  atendimentosRealizados: number
  atendimentosCancelados: number
  atendimentosNaoCompareceu: number
  valorTotal: number
  valorPago: number
  valorPendente: number
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
