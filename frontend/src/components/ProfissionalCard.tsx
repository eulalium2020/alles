import React from 'react'
import { Profissional } from '@types/index'

/**
 * 💳 Props para card de profissional
 */
interface ProfissionalCardProps {
  profissional: Profissional
  onEdit: (profissional: Profissional) => void
  onDelete: (profissional: Profissional) => void
}

/**
 * 💳 Card individual de profissional
 */
export const ProfissionalCard: React.FC<ProfissionalCardProps> = ({
  profissional,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{profissional.nome}</h3>
          <p className="text-sm text-gray-600">CRM: {profissional.crm}</p>
        </div>
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            profissional.ativo
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {profissional.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="space-y-1 mb-4 text-sm text-gray-700">
        <p>
          <strong>Email:</strong> {profissional.email}
        </p>
        <p>
          <strong>Telefone:</strong> {profissional.telefone}
        </p>
        <p>
          <strong>Horários:</strong> {profissional.horariosAtendimento}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(profissional)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(profissional)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-medium transition"
        >
          Deletar
        </button>
      </div>
    </div>
  )
}
