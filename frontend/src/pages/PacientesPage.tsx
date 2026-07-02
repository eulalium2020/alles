import React, { useEffect, useState } from 'react'
import { usePaciente } from '@hooks/usePaciente'
import { Paciente } from '@types/index'
import { PacienteList } from '@components/PacienteList'
import { PacienteModal } from '@components/PacienteModal'

/**
 * 🏥 Página de Pacientes
 */
export const PacientesPage: React.FC = () => {
  const {
    pacientes,
    loading,
    error,
    pagination,
    fetchPacientes,
    create,
    update,
    remove,
    clearError,
  } = usePaciente()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<Paciente | null>(null)

  /**
   * Carregar pacientes ao montar
   */
  useEffect(() => {
    fetchPacientes(0, 10)
  }, [fetchPacientes])

  /**
   * Abrir modal para criar novo
   */
  const handleNewClick = () => {
    setSelectedPaciente(undefined)
    setIsModalOpen(true)
  }

  /**
   * Abrir modal para editar
   */
  const handleEdit = (paciente: Paciente) => {
    setSelectedPaciente(paciente)
    setIsModalOpen(true)
  }

  /**
   * Confirmar deleção
   */
  const handleDeleteClick = (paciente: Paciente) => {
    setDeleteConfirm(paciente)
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
  const handleSubmit = async (data: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    try {
      if (selectedPaciente) {
        await update(selectedPaciente.id, data)
      } else {
        await create(data)
      }
      setIsModalOpen(false)
      setSelectedPaciente(undefined)
    } catch (err) {
      console.error('Erro ao salvar:', err)
    }
  }

  /**
   * Mudar página
   */
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < pagination.totalPages) {
      fetchPacientes(page, pagination.pageSize)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
        <button
          onClick={handleNewClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          ➕ Novo Paciente
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

      {/* Lista de pacientes */}
      <div className="bg-white rounded-lg shadow">
        <PacienteList
          pacientes={pacientes}
          loading={loading}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal de formulário */}
      <PacienteModal
        isOpen={isModalOpen}
        paciente={selectedPaciente}
        onSubmit={handleSubmit}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPaciente(undefined)
        }}
        isLoading={loading}
      />

      {/* Diálogo de confirmação de deleção */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar o paciente <strong>{deleteConfirm.nome}</strong>?
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
