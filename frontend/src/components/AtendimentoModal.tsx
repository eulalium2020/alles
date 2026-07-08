import React from 'react'
import { AtendimentoComDetalhes } from '@/types'
import { AtendimentoForm } from './AtendimentoForm'

/**
 * 🔲 Props para modal de atendimento
 */
interface AtendimentoModalProps {
  isOpen: boolean
  atendimento?: AtendimentoComDetalhes
  onSubmit: (data: Omit<AtendimentoComDetalhes, 'id' | 'criadoEm' | 'atualizadoEm' | 'profissional' | 'paciente' | 'valor'>) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

/**
 * 🔲 Modal para agendar/editar atendimento
 */
export const AtendimentoModal: React.FC<AtendimentoModalProps> = ({
  isOpen,
  atendimento,
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
            {atendimento ? 'Editar Atendimento' : 'Novo Atendimento'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <AtendimentoForm
          initialData={atendimento}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
