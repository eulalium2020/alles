import React from 'react'
import { Paciente } from '@/types'

/**
 * 📋 Props para lista de pacientes
 */
interface PacienteListProps {
  pacientes: Paciente[]
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalElements: number
  }
  onEdit: (paciente: Paciente) => void
  onDelete: (paciente: Paciente) => void
  onPageChange: (page: number) => void
}

/**
 * 📋 Tabela de pacientes com paginação
 */
export const PacienteList: React.FC<PacienteListProps> = ({
  pacientes,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  if (loading && pacientes.length === 0) {
    return <div className="text-center py-8 text-gray-600">Carregando...</div>
  }

  if (pacientes.length === 0) {
    return <div className="text-center py-8 text-gray-600">Nenhum paciente encontrado</div>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
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
            }}>CPF</th>
            <th style={{
              padding: 'var(--spacing-md)',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              borderBottom: '2px solid var(--border-color)',
              fontFamily: 'var(--font-headings)'
            }}>Data Nascimento</th>
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
          {pacientes.map((pac) => (
            <tr 
              key={pac.id}
              style={{
                borderBottom: '1px solid var(--border-color)',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--light-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>{pac.nome}</td>
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>{pac.email}</td>
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>{pac.cpf}</td>
              <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-dark)' }}>
                {formatDate(pac.dataNascimento)}
              </td>
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
                    backgroundColor: pac.ativo ? '#D5F4E6' : '#FADBD8',
                    color: pac.ativo ? '#0A5F3D' : '#78281F',
                    border: `1.5px solid ${pac.ativo ? 'var(--success-green)' : 'var(--error-red)'}`
                  }}
                >
                  <span>{pac.ativo ? '✓' : '✕'}</span>
                  {pac.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                <button
                  onClick={() => onEdit(pac)}
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
                  onClick={() => onDelete(pac)}
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
      <div className="flex items-center justify-between mt-4 px-4">
        <div className="text-sm text-gray-600">
          Mostrando {pacientes.length} de {pagination.totalElements} pacientes
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 0 || loading}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Anterior
          </button>
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-3 py-1 rounded transition ${
                pagination.page === i
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
              disabled={loading}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1 || loading}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  )
}
