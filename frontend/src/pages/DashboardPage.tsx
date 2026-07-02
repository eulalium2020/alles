import React from 'react'
import { useUsuario, useCanAccess } from '@store/authStore'
import { useAuth } from '@hooks/useAuth'
import { ROLES } from '@constants/api'

/**
 * 📊 Página Dashboard
 * Exibe informações personalizadas por perfil de usuário
 */
export const DashboardPage: React.FC = () => {
  const usuario = useUsuario()
  const canAccess = useCanAccess()
  const { logout } = useAuth()

  const isDashboardAdmin = canAccess([ROLES.ADMIN, ROLES.GERENTE])
  const isProfissional = usuario?.perfil === ROLES.PROFISSIONAL
  const isPaciente = usuario?.perfil === ROLES.PACIENTE

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ALLES</h1>
            <p className="text-gray-600">Bem-vindo, {usuario?.nome}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {usuario?.perfil}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-gray-600 text-sm">Informações da Conta</p>
                <p className="text-2xl font-bold text-gray-900">{usuario?.email}</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          {isProfissional && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Atendimentos</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-xs text-gray-600 mt-2">Este mês</p>
            </div>
          )}

          {/* Card 3 */}
          {isProfissional && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Faturamento</p>
              <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
              <p className="text-xs text-gray-600 mt-2">Este mês</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isDashboardAdmin && (
              <>
                <a
                  href="/profissionais"
                  className="block p-4 border rounded hover:bg-blue-50 transition"
                >
                  <p className="font-semibold text-blue-600">👨‍⚕️</p>
                  <p className="text-sm font-medium">Profissionais</p>
                </a>
                <a
                  href="/pacientes"
                  className="block p-4 border rounded hover:bg-blue-50 transition"
                >
                  <p className="font-semibold text-blue-600">👥</p>
                  <p className="text-sm font-medium">Pacientes</p>
                </a>
              </>
            )}

            {(isDashboardAdmin || isProfissional) && (
              <a
                href="/atendimentos"
                className="block p-4 border rounded hover:bg-blue-50 transition"
              >
                <p className="font-semibold text-blue-600">📅</p>
                <p className="text-sm font-medium">Atendimentos</p>
              </a>
            )}

            {isDashboardAdmin && (
              <a
                href="/relatorios"
                className="block p-4 border rounded hover:bg-blue-50 transition"
              >
                <p className="font-semibold text-blue-600">📊</p>
                <p className="text-sm font-medium">Relatórios</p>
              </a>
            )}

            {isPaciente && (
              <a
                href="/agendar"
                className="block p-4 border rounded hover:bg-blue-50 transition"
              >
                <p className="font-semibold text-blue-600">🗓️</p>
                <p className="text-sm font-medium">Agendar</p>
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
