import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useCanAccess } from '@store/authStore'
import { ROLES } from '@constants/api'

/**
 * 🎨 Sidebar melhorada com navegação por ícones
 */
export const Sidebar: React.FC = () => {
  const location = useLocation()
  const { logout } = useAuth()
  const canAccess = useCanAccess()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const isAdmin = canAccess([ROLES.ADMIN, ROLES.GERENTE])

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: '📊',
      roles: [ROLES.ADMIN, ROLES.GERENTE, ROLES.PROFISSIONAL, ROLES.PACIENTE],
    },
    {
      label: 'Atendimentos',
      path: '/atendimentos',
      icon: '📅',
      roles: [ROLES.ADMIN, ROLES.GERENTE, ROLES.PROFISSIONAL],
    },
    {
      label: 'Pacientes',
      path: '/pacientes',
      icon: '👥',
      roles: [ROLES.ADMIN, ROLES.GERENTE, ROLES.CLINICA],
      submenu: [
        { label: 'Listar Pacientes', path: '/pacientes' },
        { label: 'Novo Paciente', path: '/pacientes/novo' },
      ],
    },
    {
      label: 'Profissionais',
      path: '/profissionais',
      icon: '🩺',
      roles: [ROLES.ADMIN, ROLES.GERENTE, ROLES.CLINICA],
      submenu: [
        { label: 'Listar Profissionais', path: '/profissionais' },
        { label: 'Novo Profissional', path: '/profissionais/novo' },
      ],
    },
    {
      label: 'Relatórios',
      path: '/relatorios',
      icon: '📄',
      roles: [ROLES.ADMIN, ROLES.GERENTE],
    },
  ]

  const filteredItems = navigationItems.filter((item) =>
    item.roles.some((role) => canAccess([role])),
  )

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xl"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white shadow-xl transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold text-white">🏥 ALLES</h1>
          <p className="text-xs text-blue-200 mt-1">Clínica Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {filteredItems.map((item) => {
            const isItemActive = isActive(item.path)
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isSubmenuOpen = expandedMenu === item.label

            return (
              <div key={item.label}>
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      isSubmenuOpen
                        ? 'bg-blue-700 text-white'
                        : 'hover:bg-blue-700 text-blue-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className={`text-lg transition-transform ${
                        isSubmenuOpen ? 'rotate-180' : ''
                      }`}>
                      ⌄
                    </span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isItemActive
                        ? 'bg-white text-blue-900 font-semibold shadow-lg'
                        : 'hover:bg-blue-700 text-blue-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && isSubmenuOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-600">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2 rounded text-sm transition ${
                          isActive(subitem.path)
                            ? 'bg-white text-blue-900 font-semibold'
                            : 'hover:bg-blue-700 text-blue-100'
                        }`}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700 space-y-2">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition text-blue-100"
          >
            <span className="text-xl">⚙️</span>
            <span>Configurações</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700 transition text-blue-100"
          >
            <span className="text-xl">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Shift */}
      <div className="hidden lg:block lg:ml-64" />
    </>
  )
}
