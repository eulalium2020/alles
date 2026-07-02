import React from 'react'
import { Paciente } from '@types/index'

/**
 * 💳 Props para card de paciente
 */
interface PacienteCardProps {
  paciente: Paciente
  onEdit: (paciente: Paciente) => void
  onDelete: (paciente: Paciente) => void
}

/**
 * 💳 Card individual de paciente
 */
export const PacienteCard: React.FC<PacienteCardProps> = ({
  paciente,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{paciente.nome}</h3>
          <p className="text-sm text-gray-600">CPF: {paciente.cpf}</p>
        </div>
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            paciente.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {paciente.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="space-y-1 mb-4 text-sm text-gray-700">
        <p>
          <strong>Email:</strong> {paciente.email}
        </p>
        <p>
          <strong>Telefone:</strong> {paciente.telefone}
        </p>
        <p>
          <strong>Data Nascimento:</strong> {formatDate(paciente.dataNascimento)}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(paciente)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(paciente)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-medium transition"
        >
          Deletar
        </button>
      </div>
    </div>
  )
}
