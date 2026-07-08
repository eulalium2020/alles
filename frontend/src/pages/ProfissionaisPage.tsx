import React, { useEffect, useState } from 'react'
import { useProfissional } from '@hooks/useProfissional'
import { Profissional } from '@/types'
import { ProfissionalList } from '@components/ProfissionalList'
import { ProfissionalModal } from '@components/ProfissionalModal'

/**
 * 👨‍⚕️ Página de Profissionais
 */
export const ProfissionaisPage: React.FC = () => {
  const {
    profissionais,
    loading,
    error,
    pagination,
    fetchProfissionais,
    create,
    update,
    remove,
    clearError,
  } = useProfissional()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<Profissional | null>(null)

  /**
   * Carregar profissionais ao montar
   */
  useEffect(() => {
    fetchProfissionais(0, 10)
  }, [fetchProfissionais])

  /**
   * Abrir modal para criar novo
   */
  const handleNewClick = () => {
    setSelectedProfissional(undefined)
    setIsModalOpen(true)
  }

  /**
   * Abrir modal para editar
   */
  const handleEdit = (profissional: Profissional) => {
    setSelectedProfissional(profissional)
    setIsModalOpen(true)
  }

  /**
   * Confirmar deleção
   */
  const handleDeleteClick = (profissional: Profissional) => {
    setDeleteConfirm(profissional)
  }

  /**
   * Executar deleção
   */
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return

    try {
      await remove(deleteConfirm.id)
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Erro ao deletar:', err)
    }
  }

  /**
   * Submeter formulário
   */
  const handleSubmit = async (
    data: Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm'>,
  ) => {
    try {
      if (selectedProfissional) {
        await update(selectedProfissional.id, data)
      } else {
        await create(data)
      }
      setIsModalOpen(false)
      setSelectedProfissional(undefined)
    } catch (err) {
      console.error('Erro ao salvar:', err)
    }
  }

  /**
   * Mudar página
   */
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

      {/* Mensagens de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="absolute top-2 right-2 text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Lista de profissionais */}
      <div className="bg-white rounded-lg shadow">
        <ProfissionalList
          profissionais={profissionais}
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
