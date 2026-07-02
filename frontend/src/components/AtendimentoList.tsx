import React from 'react'
import { AtendimentoComDetalhes } from '@types/index'

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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Data/Hora</th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Profissional</th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Paciente</th>
            <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Tipo</th>
            <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Status</th>
            <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {atendimentos.map((atend) => (
            <tr key={atend.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2">{formatDateTime(atend.dataHora)}</td>
              <td className="border border-gray-300 px-3 py-2">{atend.profissional.nome}</td>
              <td className="border border-gray-300 px-3 py-2">{atend.paciente.nome}</td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                <span className="text-xs font-medium">
                  {atend.tipoAtendimento === 'PRESENCIAL' ? '🏥' : '📱'}
                  {atend.tipoAtendimento}
                </span>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(atend.status)}`}>
                  {atend.status}
                </span>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center space-x-1">
                {atend.status === 'AGENDADO' && (
                  <>
                    {onRegistrarPresenca && (
                      <button
                        onClick={() => onRegistrarPresenca(atend)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition"
                        disabled={loading}
                      >
                        ✓
                      </button>
                    )}
                    {onCancelar && (
                      <button
                        onClick={() => onCancelar(atend)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition"
                        disabled={loading}
                      >
                        ✕
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => onEdit(atend)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(atend)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition"
                  disabled={loading}
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex items-center justify-between mt-4 px-4">
        <div className="text-sm text-gray-600">
          Mostrando {atendimentos.length} de {pagination.totalElements} atendimentos
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 0 || loading}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Anterior
          </button>
          {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
            const pageNum = pagination.page + i - 2
            if (pageNum < 0 || pageNum >= pagination.totalPages) return null
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 rounded transition ${
                  pagination.page === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
                disabled={loading}
              >
                {pageNum + 1}
              </button>
            )
          })}
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
