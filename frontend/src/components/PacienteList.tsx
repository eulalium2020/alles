import React from 'react'
import { Paciente } from '@types/index'

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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Nome</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">CPF</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Data Nascimento
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((pac) => (
            <tr key={pac.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{pac.nome}</td>
              <td className="border border-gray-300 px-4 py-2">{pac.email}</td>
              <td className="border border-gray-300 px-4 py-2">{pac.cpf}</td>
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(pac.dataNascimento)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <span
                  className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    pac.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {pac.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => onEdit(pac)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm transition"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(pac)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                  disabled={loading}
                >
                  Deletar
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
