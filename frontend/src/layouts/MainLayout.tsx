import React, { ReactNode } from 'react'
import { useUsuario } from '@store/authStore'
import { useAuth } from '@hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface MainLayoutProps {
  children: ReactNode
}

/**
 * 🎨 Layout principal com header e navegação
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const usuario = useUsuario()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">ALLES</h1>
            <nav className="ml-8 flex space-x-8">
              <a
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </a>
              <a
                href="/profissionais"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Profissionais
              </a>
              <a
                href="/pacientes"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Pacientes
              </a>
              <a
                href="/atendimentos"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Atendimentos
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{usuario?.nome}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
