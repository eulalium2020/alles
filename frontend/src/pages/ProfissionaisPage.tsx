import React, { useEffect, useMemo, useState } from 'react'
import { useProfissional } from '@hooks/useProfissional'
import { useToast } from '@components/Toast'
import { Profissional } from '@/types'
import { ProfissionalList } from '@components/ProfissionalList'
import { ProfissionalModal } from '@components/ProfissionalModal'

/**
 * 👨‍⚕️ Página de Profissionais
 */
export const ProfissionaisPage: React.FC = () => {
  const toast = useToast()
  const {
    profissionais,
    loading,
    pagination,
    fetchProfissionais,
    create,
    update,
    remove,
  } = useProfissional()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<Profissional | null>(null)
  const [busca, setBusca] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativo' | 'inativo'>('todos')

  const profissionaisFiltrados = useMemo(() => {
    return profissionais.filter((p) => {
      const matchBusca =
        !busca ||
        p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        p.crm?.toLowerCase().includes(busca.toLowerCase()) ||
        p.email?.toLowerCase().includes(busca.toLowerCase())
      const matchAtivo =
        filtroAtivo === 'todos' ||
        (filtroAtivo === 'ativo' && p.ativo) ||
        (filtroAtivo === 'inativo' && !p.ativo)
      return matchBusca && matchAtivo
    })
  }, [profissionais, busca, filtroAtivo])

  useEffect(() => {
    fetchProfissionais(0, 10)
  }, [fetchProfissionais])

  const handleNewClick = () => {
    setSelectedProfissional(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (profissional: Profissional) => {
    setSelectedProfissional(profissional)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (profissional: Profissional) => {
    setDeleteConfirm(profissional)
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return
    try {
      await remove(deleteConfirm.id)
      setDeleteConfirm(null)
      toast.success(`Profissional ${deleteConfirm.nome} removido.`)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao deletar profissional.')
    }
  }

  const handleSubmit = async (
    data: Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm'>,
  ) => {
    try {
      if (selectedProfissional) {
        await update(selectedProfissional.id, data)
        toast.success('Profissional atualizado com sucesso!')
      } else {
        await create(data)
        toast.success('Profissional criado com sucesso!')
      }
      setIsModalOpen(false)
      setSelectedProfissional(undefined)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar profissional.')
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < pagination.totalPages) {
      fetchProfissionais(page, pagination.pageSize)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Profissionais</h1>
        <button
          onClick={handleNewClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          ➕ Novo Profissional
        </button>
      </div>

      {/* Busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nome, CRM ou email..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filtroAtivo}
          onChange={(e) => setFiltroAtivo(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
        {busca && (
          <span className="self-center text-sm text-gray-500">
            {profissionaisFiltrados.length} resultado(s)
          </span>
        )}
      </div>

      {/* Lista de profissionais */}
      <div className="bg-white rounded-lg shadow">
        <ProfissionalList
          profissionais={profissionaisFiltrados}
          loading={loading}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal de formulário */}
      <ProfissionalModal
        isOpen={isModalOpen}
        profissional={selectedProfissional}
        onSubmit={handleSubmit}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProfissional(undefined)
        }}
        isLoading={loading}
      />

      {/* Diálogo de confirmação de deleção */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar o profissional <strong>{deleteConfirm.nome}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition"
              >
                Deletar
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
