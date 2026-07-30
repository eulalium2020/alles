import React, { useEffect, useState } from 'react'
import { useUsuario } from '@hooks/useUsuario'
import { useCanAccess } from '@store/authStore'
import { useToast } from '@components/Toast'
import { Perfil } from '@/types'
import { ROLES } from '@constants/api'

interface UsuarioFormData {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  cpf: string
  telefone: string
  perfil: Perfil
  ativo: boolean
}

const initialFormState: UsuarioFormData = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  cpf: '',
  telefone: '',
  perfil: ROLES.RECEPCIONISTA,
  ativo: true,
}

const onlyDigits = (value: string): string => value.replace(/\D/g, '')

export const UsuariosPage: React.FC = () => {
  const canAccess = useCanAccess()
  const toast = useToast()
  const { usuarios, perfis, loading, pagination, fetchUsuarios, fetchPerfis, create } = useUsuario()

  const [formData, setFormData] = useState<UsuarioFormData>(initialFormState)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isAdmin = canAccess([ROLES.ADMIN])

  useEffect(() => {
    if (!isAdmin) return
    fetchUsuarios(0, 10)
    fetchPerfis()
  }, [isAdmin, fetchUsuarios, fetchPerfis])

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Usuários</h1>
        <p className="text-gray-600">Apenas administradores podem acessar esta tela.</p>
      </div>
    )
  }

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < pagination.totalPages) {
      fetchUsuarios(page, pagination.pageSize)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não conferem.')
      return
    }

    try {
      await create({
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha,
        cpf: formData.cpf ? onlyDigits(formData.cpf) : undefined,
        telefone: formData.telefone ? onlyDigits(formData.telefone) : undefined,
        perfil: formData.perfil,
        ativo: formData.ativo,
      })
      toast.success('Usuário criado com sucesso!')
      setFormData(initialFormState)
      setIsModalOpen(false)
      fetchUsuarios(0, pagination.pageSize)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar usuário')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Usuários de Acesso</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          ➕ Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700">Nome</th>
              <th className="text-left p-3 font-semibold text-gray-700">Email</th>
              <th className="text-left p-3 font-semibold text-gray-700">Perfil</th>
              <th className="text-center p-3 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  {loading ? 'Carregando...' : 'Nenhum usuário encontrado'}
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-t">
                  <td className="p-3">{usuario.nome}</td>
                  <td className="p-3">{usuario.email}</td>
                  <td className="p-3">{usuario.perfil}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        usuario.ativo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <span className="text-sm text-gray-600">
            Mostrando {usuarios.length} de {pagination.totalElements} usuários
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0 || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1 || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novo Usuário de Acesso</h2>
              <button
                onClick={() => {
                  setFormData(initialFormState)
                  setIsModalOpen(false)
                }}
                className="text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <select
                value={formData.perfil}
                onChange={(e) => setFormData((prev) => ({ ...prev, perfil: e.target.value as Perfil }))}
                className="w-full px-3 py-2 border rounded"
                required
              >
                {perfis.map((perfil) => (
                  <option key={perfil} value={perfil}>
                    {perfil}
                  </option>
                ))}
              </select>
              <input
                type="password"
                placeholder="Senha"
                value={formData.senha}
                onChange={(e) => setFormData((prev) => ({ ...prev, senha: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                minLength={6}
                required
              />
              <input
                type="password"
                placeholder="Confirmar senha"
                value={formData.confirmarSenha}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, confirmarSenha: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded"
                minLength={6}
                required
              />
              <input
                type="text"
                placeholder="CPF (opcional)"
                value={formData.cpf}
                onChange={(e) => setFormData((prev) => ({ ...prev, cpf: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Telefone (opcional)"
                value={formData.telefone}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ativo: e.target.checked }))}
                />
                Usuário ativo
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialFormState)
                    setIsModalOpen(false)
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
