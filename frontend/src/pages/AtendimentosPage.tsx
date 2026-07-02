import React, { useEffect, useState } from 'react'
import { useAtendimento } from '@hooks/useAtendimento'
import { Atendimento, AtendimentoComDetalhes } from '@types/index'
import { AtendimentoList } from '@components/AtendimentoList'
import { AtendimentoModal } from '@components/AtendimentoModal'

/**
 * 📅 Página de Atendimentos
 */
export const AtendimentosPage: React.FC = () => {
  const {
    atendimentos,
    loading,
    error,
    pagination,
    fetchAtendimentos,
    agendar,
    update,
    registrarPresenca,
    cancelar,
    remove,
    clearError,
  } = useAtendimento()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAtendimento, setSelectedAtendimento] = useState<AtendimentoComDetalhes | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<AtendimentoComDetalhes | null>(null)
  const [presencaConfirm, setPresencaConfirm] = useState<AtendimentoComDetalhes | null>(null)
  const [cancelarConfirm, setCancelarConfirm] = useState<AtendimentoComDetalhes | null>(null)

  /**
   * Carregar atendimentos ao montar
   */
  useEffect(() => {
    fetchAtendimentos(0, 10)
  }, [fetchAtendimentos])

  /**
   * Abrir modal para novo agendamento
   */
  const handleNewClick = () => {
    setSelectedAtendimento(undefined)
    setIsModalOpen(true)
  }

  /**
   * Abrir modal para editar
   */
  const handleEdit = (atendimento: AtendimentoComDetalhes) => {
    setSelectedAtendimento(atendimento)
    setIsModalOpen(true)
  }

  /**
   * Confirmar deleção
   */
  const handleDeleteClick = (atendimento: AtendimentoComDetalhes) => {
    setDeleteConfirm(atendimento)
  }

  /**
   * Submeter formulário
   */
  const handleSubmit = async (
    data: Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'>,
  ) => {
    try {
      if (selectedAtendimento) {
        await update(selectedAtendimento.id, data)
      } else {
        await agendar(data)
      }
      setIsModalOpen(false)
      setSelectedAtendimento(undefined)
    } catch (err) {
      console.error('Erro ao salvar:', err)
    }
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
   * Registrar presença
   */
  const handleConfirmPresenca = async () => {
    if (!presencaConfirm) return

    try {
      await registrarPresenca(presencaConfirm.id)
      setPresencaConfirm(null)
    } catch (err) {
      console.error('Erro ao registrar presença:', err)
    }
  }

  /**
   * Cancelar atendimento
   */
  const handleConfirmCancelar = async () => {
    if (!cancelarConfirm) return

    try {
      await cancelar(cancelarConfirm.id)
      setCancelarConfirm(null)
    } catch (err) {
      console.error('Erro ao cancelar:', err)
    }
  }

  /**
   * Mudar página
   */
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < pagination.totalPages) {
      fetchAtendimentos(page, pagination.pageSize)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Atendimentos</h1>
        <button
          onClick={handleNewClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          ➕ Novo Agendamento
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

      {/* Lista de atendimentos */}
      <div className="bg-white rounded-lg shadow">
        <AtendimentoList
          atendimentos={atendimentos}
          loading={loading}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onRegistrarPresenca={setPresencaConfirm}
          onCancelar={setCancelarConfirm}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal de agendamento */}
      <AtendimentoModal
        isOpen={isModalOpen}
        atendimento={selectedAtendimento}
        onSubmit={handleSubmit}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedAtendimento(undefined)
        }}
        isLoading={loading}
      />

      {/* Diálogo de confirmação de presença */}
      {presencaConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-4">Registrar Presença</h3>
            <p className="text-gray-700 mb-6">
              Registrar presença de <strong>{presencaConfirm.paciente.nome}</strong> no atendimento com <strong>{presencaConfirm.profissional.nome}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmPresenca}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition"
              >
                Confirmar
              </button>
              <button
                onClick={() => setPresencaConfirm(null)}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmação de cancelamento */}
      {cancelarConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-4">Cancelar Atendimento</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja cancelar o atendimento de <strong>{cancelarConfirm.paciente.nome}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmCancelar}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition"
              >
                Cancelar Atendimento
              </button>
              <button
                onClick={() => setCancelarConfirm(null)}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium transition"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmação de deleção */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar este atendimento?
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
