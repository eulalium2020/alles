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
 * 🔲 Modal elegante para agendar/editar atendimento
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
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center border-b border-blue-800">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {atendimento ? '✏️ Editar Atendimento' : '📅 Novo Agendamento'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">Preencha os dados abaixo com atenção</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg disabled:opacity-50 transition text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <AtendimentoForm
            initialData={atendimento}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
