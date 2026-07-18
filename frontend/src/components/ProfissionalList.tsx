import React from 'react'
import { Profissional } from '@/types'

/**
 * 📋 Props para lista de profissionais
 */
interface ProfissionalListProps {
  profissionais: Profissional[]
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalElements: number
  }
  onEdit: (profissional: Profissional) => void
  onDelete: (profissional: Profissional) => void
  onPageChange: (page: number) => void
}

/**
 * 📋 Tabela de profissionais com paginação - Healthcare Design
 */
export const ProfissionalList: React.FC<ProfissionalListProps> = ({
  profissionais,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  console.log('📊 ProfissionalList - Dados recebidos:', { profissionais, pagination })
  
  if (loading && profissionais.length === 0) {
    return <div style={{
      textAlign: 'center',
      paddingTop: 'var(--spacing-xl)',
      paddingBottom: 'var(--spacing-xl)',
      color: 'var(--gray-medium)',
      fontSize: '0.95rem'
    }}>Carregando...</div>
  }

  if (profissionais.length === 0) {
    return <div style={{
      textAlign: 'center',
      paddingTop: 'var(--spacing-xl)',
      paddingBottom: 'var(--spacing-xl)',
      color: 'var(--gray-medium)',
      fontSize: '0.95rem'
    }}>Nenhum profissional encontrado</div>
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
            }}>Nome</th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>Email</th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>Órgão de Classe</th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>Telefone</th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'center',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>Status</th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'center',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {profissionais.map((prof) => (
            <tr 
              key={prof.id}
              style={{
                borderBottom: '1px solid var(--border-color)',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--light-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>{prof.nome}</td>
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>{prof.email}</td>
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>{prof.crm}</td>
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>{prof.telefone}</td>
              <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    backgroundColor: prof.ativo ? '#D5F4E6' : '#FADBD8',
                    color: prof.ativo ? '#0A5F3D' : '#78281F',
                    border: `1.5px solid ${prof.ativo ? 'var(--success-green)' : 'var(--error-red)'}`
                  }}
                >
                  <span>{prof.ativo ? '✓' : '✕'}</span>
                  {prof.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                <button
                  onClick={() => onEdit(prof)}
                  style={{
                    padding: '6px 12px',
                    marginRight: 'var(--spacing-xs)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--white)',
                    boxShadow: 'var(--shadow-sm)',
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
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-sm)';
                  }}
                  disabled={loading}
                >
                  ✎ Editar
                </button>
                <button
                  onClick={() => onDelete(prof)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'var(--error-red)',
                    color: 'var(--white)',
                    boxShadow: 'var(--shadow-sm)',
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
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-sm)';
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
        paddingLeft: 'var(--spacing-md)',
        paddingRight: 'var(--spacing-md)',
        paddingTop: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-md)',
        backgroundColor: 'var(--light-bg)',
        borderTop: '1px solid var(--border-color)',
        borderRadius: '0 0 var(--radius-sm) var(--radius-sm)'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
          Mostrando {profissionais.length} de {pagination.totalElements} profissionais
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
