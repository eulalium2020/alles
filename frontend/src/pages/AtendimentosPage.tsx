import React, { useEffect, useMemo, useState } from 'react'
import { useAtendimento } from '@hooks/useAtendimento'
import { useToast } from '@components/Toast'
import { Atendimento, AtendimentoComDetalhes, StatusAtendimento } from '@/types'
import { AtendimentoList } from '@components/AtendimentoList'
import { AtendimentoModal } from '@components/AtendimentoModal'

/**
 * 📅 Página de Atendimentos
 */
export const AtendimentosPage: React.FC = () => {
  const toast = useToast()
  const {
    atendimentos,
    loading,
    pagination,
    fetchAtendimentos,
    agendar,
    update,
    registrarPresenca,
    cancelar,
    remove,
  } = useAtendimento()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAtendimento, setSelectedAtendimento] = useState<AtendimentoComDetalhes | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<AtendimentoComDetalhes | null>(null)
  const [presencaConfirm, setPresencaConfirm] = useState<AtendimentoComDetalhes | null>(null)
  const [cancelarConfirm, setCancelarConfirm] = useState<AtendimentoComDetalhes | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<StatusAtendimento | 'TODOS'>('TODOS')

  const atendimentosFiltrados = useMemo(() => {
    if (filtroStatus === 'TODOS') return atendimentos
    return atendimentos.filter((a) => a.status === filtroStatus)
  }, [atendimentos, filtroStatus])

  useEffect(() => {
    fetchAtendimentos(0, 10)
  }, [fetchAtendimentos])

  const handleNewClick = () => {
    setSelectedAtendimento(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (atendimento: AtendimentoComDetalhes) => {
    setSelectedAtendimento(atendimento)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (atendimento: AtendimentoComDetalhes) => {
    setDeleteConfirm(atendimento)
  }

  const handleSubmit = async (
    data: Omit<Atendimento, 'id' | 'criadoEm' | 'atualizadoEm'>,
  ) => {
    try {
      if (selectedAtendimento) {
        await update(selectedAtendimento.id, data)
        toast.success('Atendimento atualizado!')
      } else {
        await agendar(data)
        toast.success('Atendimento agendado com sucesso!')
      }
      setIsModalOpen(false)
      setSelectedAtendimento(undefined)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar atendimento.')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return
    try {
      await remove(deleteConfirm.id)
      setDeleteConfirm(null)
      toast.success('Atendimento removido.')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao deletar atendimento.')
    }
  }

  const handleConfirmPresenca = async () => {
    if (!presencaConfirm) return
    try {
      await registrarPresenca(presencaConfirm.id)
      setPresencaConfirm(null)
      toast.success('Presença registrada!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao registrar presença.')
    }
  }

  const handleConfirmCancelar = async () => {
    if (!cancelarConfirm) return
    try {
      await cancelar(cancelarConfirm.id)
      setCancelarConfirm(null)
      toast.info('Atendimento cancelado.')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cancelar atendimento.')
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < pagination.totalPages) {
      fetchAtendimentos(page, pagination.pageSize)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Atendimentos</h1>
        <button
          onClick={handleNewClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          ➕ Novo Agendamento
        </button>
      </div>

      {/* Filtro por status */}
      <div className="flex flex-wrap gap-2">
        {(['TODOS', 'AGENDADO', 'REALIZADO', 'CANCELADO', 'NAO_COMPARECEU'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFiltroStatus(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              filtroStatus === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'TODOS' ? 'Todos' : s.replace('_', ' ')}
            {s !== 'TODOS' && (
              <span className="ml-1 opacity-70">
                ({atendimentos.filter((a) => a.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de atendimentos */}
      <div className="bg-white rounded-lg shadow">
        <AtendimentoList
          atendimentos={atendimentosFiltrados}
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
            <p className="text-gray-700 mb-6">Tem certeza que deseja deletar este atendimento?</p>
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
