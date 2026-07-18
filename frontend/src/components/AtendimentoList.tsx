import React from 'react'
import { AtendimentoComDetalhes } from '@/types'
import { StatusBadge } from './StatusBadge'

/**
 * 📋 Props para lista de atendimentos
 */
interface AtendimentoListProps {
  atendimentos: AtendimentoComDetalhes[]
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalElements: number
  }
  onEdit: (atendimento: AtendimentoComDetalhes) => void
  onDelete: (atendimento: AtendimentoComDetalhes) => void
  onRegistrarPresenca?: (atendimento: AtendimentoComDetalhes) => void
  onCancelar?: (atendimento: AtendimentoComDetalhes) => void
  onPageChange: (page: number) => void
}

/**
 * 📋 Tabela de atendimentos com paginação
 */
export const AtendimentoList: React.FC<AtendimentoListProps> = ({
  atendimentos,
  loading,
  pagination,
  onEdit,
  onDelete,
  onRegistrarPresenca,
  onCancelar,
  onPageChange,
}) => {
  if (loading && atendimentos.length === 0) {
    return <div className="text-center py-8 text-gray-600">Carregando...</div>
  }

  if (atendimentos.length === 0) {
    return <div className="text-center py-8 text-gray-600">Nenhum atendimento encontrado</div>
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AGENDADO: 'bg-blue-100 text-blue-800',
      REALIZADO: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800',
      NAO_COMPARECEU: 'bg-yellow-100 text-yellow-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div style={{ overflow: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'var(--white)',
        fontSize: '0.9rem'
      }}>
        <thead style={{ backgroundColor: 'var(--light-bg)' }}>
          <tr>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>
              Data/Hora
            </th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>
              Profissional
            </th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>
              Paciente
            </th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'center',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>
              Tipo
            </th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'center',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>
              Status
            </th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'center',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {atendimentos.map((atend) => (
            <tr 
              key={atend.id}
              style={{
                borderBottom: '1px solid var(--border-color)',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--light-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>
                {formatDateTime(atend.dataHora)}
              </td>
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>
                {atend.profissional.nome}
              </td>
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>
                {atend.paciente.nome}
              </td>
              <td style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--text-dark)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                  {atend.tipoAtendimento === 'PRESENCIAL' ? '🏥' : '📱'} {atend.tipoAtendimento}
                </span>
              </td>
              <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                <StatusBadge status={atend.status as any} size="sm" />
              </td>
              <td style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                display: 'flex',
                gap: 'var(--spacing-xs)',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {atend.status === 'AGENDADO' && (
                  <>
                    {onRegistrarPresenca && (
                      <button
                        onClick={() => onRegistrarPresenca(atend)}
                        style={{
                          backgroundColor: 'var(--success-green)',
                          color: 'var(--white)',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          opacity: loading ? 0.5 : 1,
                          pointerEvents: loading ? 'none' : 'auto'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1E8449';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--success-green)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                        disabled={loading}
                      >
                        ✓ Registrar
                      </button>
                    )}
                    {onCancelar && (
                      <button
                        onClick={() => onCancelar(atend)}
                        style={{
                          backgroundColor: 'var(--error-red)',
                          color: 'var(--white)',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          opacity: loading ? 0.5 : 1,
                          pointerEvents: loading ? 'none' : 'auto'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C0392B';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--error-red)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                        disabled={loading}
                      >
                        ✕ Cancelar
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => onEdit(atend)}
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--white)',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? 'none' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#084A6E';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary-blue)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                  disabled={loading}
                >
                  ✎ Editar
                </button>
                <button
                  onClick={() => onDelete(atend)}
                  style={{
                    backgroundColor: 'var(--gray-medium)',
                    color: 'var(--white)',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? 'none' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#95A5A6';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--gray-medium)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                  disabled={loading}
                >
                  🗑 Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'var(--spacing-lg)',
        paddingLeft: 'var(--spacing-md)',
        paddingRight: 'var(--spacing-md)',
        paddingTop: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-md)',
        backgroundColor: 'var(--light-bg)',
        borderTop: '1px solid var(--border-color)',
        borderRadius: '0 0 var(--radius-sm) var(--radius-sm)'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
          Mostrando {atendimentos.length} de {pagination.totalElements} atendimentos
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 0 || loading}
            style={{
              paddingLeft: 'var(--spacing-md)',
              paddingRight: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-sm)',
              paddingBottom: 'var(--spacing-sm)',
              border: `1.5px solid var(--border-color)`,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--white)',
              cursor: pagination.page === 0 || loading ? 'not-allowed' : 'pointer',
              opacity: pagination.page === 0 || loading ? 0.5 : 1,
              transition: 'all var(--transition-fast)',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-dark)'
            }}
            onMouseEnter={(e) => {
              if (pagination.page > 0 && !loading) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--light-bg)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--white)';
            }}
          >
            ← Anterior
          </button>
          {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
            const pageNum = pagination.page + i - 2
            if (pageNum < 0 || pageNum >= pagination.totalPages) return null
            const isActive = pagination.page === pageNum
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                style={{
                  paddingLeft: 'var(--spacing-md)',
                  paddingRight: 'var(--spacing-md)',
                  paddingTop: 'var(--spacing-sm)',
                  paddingBottom: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--transition-fast)',
                  border: isActive ? 'none' : `1.5px solid var(--border-color)`,
                  backgroundColor: isActive ? 'var(--primary-blue)' : 'var(--white)',
                  color: isActive ? 'var(--white)' : 'var(--text-dark)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !loading) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--light-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--white)';
                  }
                }}
                disabled={loading}
              >
                {pageNum + 1}
              </button>
            )
          })}
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1 || loading}
            style={{
              paddingLeft: 'var(--spacing-md)',
              paddingRight: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-sm)',
              paddingBottom: 'var(--spacing-sm)',
              border: `1.5px solid var(--border-color)`,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--white)',
              cursor: pagination.page >= pagination.totalPages - 1 || loading ? 'not-allowed' : 'pointer',
              opacity: pagination.page >= pagination.totalPages - 1 || loading ? 0.5 : 1,
              transition: 'all var(--transition-fast)',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-dark)'
            }}
            onMouseEnter={(e) => {
              if (pagination.page < pagination.totalPages - 1 && !loading) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--light-bg)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--white)';
            }}
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  )
}
