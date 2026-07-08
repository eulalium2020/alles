import React, { useEffect, useState } from 'react'
import { PlanoSaude } from '@/types'
import { usePlanoSaude } from '@hooks/usePlanoSaude'

export const PlanosSaudePage: React.FC = () => {
  const { planos, loading, error, pagination, fetchPlanos, create, update, remove, clearError } =
    usePlanoSaude()

  const [editing, setEditing] = useState<PlanoSaude | null>(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    fetchPlanos(0, 10)
  }, [fetchPlanos])

  const resetForm = () => {
    setEditing(null)
    setNome('')
    setDescricao('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return

    if (editing) {
      await update(editing.id, { nome, descricao })
    } else {
      await create({ nome, descricao, ativo: true })
    }
    resetForm()
  }

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < pagination.totalPages) fetchPlanos(page, pagination.pageSize)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Planos de Saúde</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span>{error}</span>
          <button onClick={clearError} className="absolute top-2 right-2">
            ✕
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">{editing ? 'Editar Plano' : 'Novo Plano'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              {editing ? 'Atualizar' : 'Criar'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Descrição</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {planos.map((plano) => (
              <tr key={plano.id}>
                <td className="border border-gray-300 px-4 py-2">{plano.nome}</td>
                <td className="border border-gray-300 px-4 py-2">{plano.descricao || '-'}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {plano.ativo ? 'Ativo' : 'Inativo'}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      setEditing(plano)
                      setNome(plano.nome)
                      setDescricao(plano.descricao || '')
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(plano.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    disabled={loading}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && planos.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-600">
                  Nenhum plano de saúde encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 0 || loading}
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages - 1 || loading}
          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
