import React, { useEffect, useMemo, useState } from 'react'
import { usePaciente } from '@hooks/usePaciente'
import { useToast } from '@components/Toast'
import { Paciente } from '@/types'
import { PacienteList } from '@components/PacienteList'
import { PacienteModal } from '@components/PacienteModal'

/**
 * 🏥 Página de Pacientes
 */
export const PacientesPage: React.FC = () => {
  const toast = useToast()
  const {
    pacientes,
    loading,
    pagination,
    fetchPacientes,
    create,
    update,
    remove,
  } = usePaciente()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<Paciente | null>(null)
  const [busca, setBusca] = useState('')

  const pacientesFiltrados = useMemo(() => {
    if (!busca) return pacientes
    return pacientes.filter(
      (p) =>
        p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        p.cpf?.includes(busca) ||
        p.email?.toLowerCase().includes(busca.toLowerCase()),
    )
  }, [pacientes, busca])

  useEffect(() => {
    fetchPacientes(0, 10).then((response) => {
      console.log('🔍 Pacientes Response:', response)
      console.log('🔍 Pacientes Content:', response?.content)
    }).catch((err) => {
      console.error('❌ Erro ao buscar pacientes:', err)
    })
  }, [fetchPacientes])

  const handleNewClick = () => {
    setSelectedPaciente(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (paciente: Paciente) => {
    setSelectedPaciente(paciente)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (paciente: Paciente) => {
    setDeleteConfirm(paciente)
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return
    try {
      await remove(deleteConfirm.id)
      setDeleteConfirm(null)
      toast.success(`Paciente ${deleteConfirm.nome} removido.`)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao deletar paciente.')
    }
  }

  const handleSubmit = async (data: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    try {
      if (selectedPaciente) {
        await update(selectedPaciente.id, data)
        toast.success('Paciente atualizado com sucesso!')
      } else {
        await create(data)
        toast.success('Paciente criado com sucesso!')
      }
      setIsModalOpen(false)
      setSelectedPaciente(undefined)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar paciente.')
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < pagination.totalPages) {
      fetchPacientes(page, pagination.pageSize)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
        <button
          onClick={handleNewClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          ➕ Novo Paciente
        </button>
      </div>

      {/* Busca */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou email..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {busca && (
          <span className="self-center text-sm text-gray-500">
            {pacientesFiltrados.length} resultado(s)
          </span>
        )}
      </div>

      {/* Lista de pacientes */}
      <div className="bg-white rounded-lg shadow">
        <PacienteList
          pacientes={pacientesFiltrados}
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
