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
 * 📋 Tabela de profissionais com paginação
 */
export const ProfissionalList: React.FC<ProfissionalListProps> = ({
  profissionais,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  if (loading && profissionais.length === 0) {
    return <div className="text-center py-8 text-gray-600">Carregando...</div>
  }

  if (profissionais.length === 0) {
    return <div className="text-center py-8 text-gray-600">Nenhum profissional encontrado</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Nome</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">CRM</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Telefone</th>
            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {profissionais.map((prof) => (
            <tr key={prof.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{prof.nome}</td>
              <td className="border border-gray-300 px-4 py-2">{prof.email}</td>
              <td className="border border-gray-300 px-4 py-2">{prof.crm}</td>
              <td className="border border-gray-300 px-4 py-2">{prof.telefone}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <span
                  className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    prof.ativo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {prof.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => onEdit(prof)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm transition"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(prof)}
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
          Mostrando {profissionais.length} de {pagination.totalElements} profissionais
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
