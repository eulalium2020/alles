import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsuario } from '@store/authStore'
import { useAuth } from '@hooks/useAuth'

/**
 * 🎨 Header melhorado com breadcrumbs e notificações
 */
export const Header: React.FC = () => {
  const usuario = useUsuario()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name?: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Left: Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Buscar pacientes, atendimentos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Right: Notifications & User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition text-xl">
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300" />

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(usuario?.nome)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{usuario?.nome || 'Usuário'}</p>
                <p className="text-xs text-gray-500">{usuario?.perfil}</p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition text-lg">
                ⌄
              </button>

              {/* Dropdown Content */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{usuario?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{usuario?.perfil}</p>
                </div>

                <div className="py-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    👤 Meu Perfil
                  </button>

                  <div className="px-4 py-2 border-t border-gray-200 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-2 py-2 rounded transition"
                    >
                      🚪 Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
