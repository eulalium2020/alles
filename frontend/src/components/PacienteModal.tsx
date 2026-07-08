import React from 'react'
import { Paciente } from '@/types'
import { PacienteForm } from './PacienteForm'

/**
 * 🔲 Props para modal de paciente
 */
interface PacienteModalProps {
  isOpen: boolean
  paciente?: Paciente
  onSubmit: (data: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

/**
 * 🔲 Modal para criar/editar paciente
 */
export const PacienteModal: React.FC<PacienteModalProps> = ({
  isOpen,
  paciente,
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {paciente ? 'Editar Paciente' : 'Novo Paciente'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <PacienteForm
          initialData={paciente}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
