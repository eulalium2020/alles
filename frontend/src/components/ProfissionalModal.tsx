import React from 'react'
import { Profissional, Especialidade } from '@/types'
import { ProfissionalForm } from './ProfissionalForm'

/**
 * 🔲 Props para modal de profissional
 */
interface ProfissionalModalProps {
  isOpen: boolean
  profissional?: Profissional
  onSubmit: (data: Omit<Profissional, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>
  onClose: () => void
  isLoading?: boolean
  especialidades?: Especialidade[]
}

/**
 * 🔲 Modal para criar/editar profissional
 */
export const ProfissionalModal: React.FC<ProfissionalModalProps> = ({
  isOpen,
  profissional,
  onSubmit,
  onClose,
  isLoading = false,
  especialidades = [],
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {profissional ? 'Editar Profissional' : 'Novo Profissional'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <ProfissionalForm
          initialData={profissional}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          especialidades={especialidades}
        />
      </div>
    </div>
  )
}
