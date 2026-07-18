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
        style={{
          display: 'none',
          position: 'fixed',
          top: 'var(--spacing-md)',
          left: 'var(--spacing-md)',
          zIndex: 50,
          padding: 'var(--spacing-sm)',
          backgroundColor: 'var(--primary-blue)',
          color: 'var(--white)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontSize: '1.2rem',
          transition: 'all var(--transition-fast)'
        }}
        className="lg:hidden"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#084A6E')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-blue)')}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: '256px',
          background: `linear-gradient(180deg, var(--primary-blue) 0%, #084A6E 100%)`,
          color: 'var(--white)',
          boxShadow: 'var(--shadow-xl)',
          transition: 'transform var(--transition-base)',
          zIndex: 40,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--white)',
            marginBottom: '4px',
            fontFamily: 'var(--font-headings)'
          }}>
            🏥 ALLES
          </h1>
          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: '4px'
          }}>
            Gerenciamento de Clínica
          </p>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          paddingTop: 'var(--spacing-lg)',
          paddingLeft: 'var(--spacing-sm)',
          paddingRight: 'var(--spacing-sm)',
          paddingBottom: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {filteredItems.map((item) => {
            const isItemActive = isActive(item.path)
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isSubmenuOpen = expandedMenu === item.label

            return (
              <div key={item.label}>
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: 'var(--spacing-md)',
                      paddingRight: 'var(--spacing-md)',
                      paddingTop: 'var(--spacing-sm)',
                      paddingBottom: 'var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all var(--transition-fast)',
                      backgroundColor: isSubmenuOpen ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                      color: isSubmenuOpen ? 'var(--white)' : 'rgba(255, 255, 255, 0.7)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmenuOpen) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--white)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmenuOpen) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255, 255, 255, 0.7)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                      <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span style={{
                      fontSize: '1rem',
                      transition: 'transform var(--transition-fast)',
                      transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ⌄
                    </span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      paddingLeft: 'var(--spacing-md)',
                      paddingRight: 'var(--spacing-md)',
                      paddingTop: 'var(--spacing-sm)',
                      paddingBottom: 'var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all var(--transition-fast)',
                      backgroundColor: isItemActive ? 'var(--white)' : 'transparent',
                      color: isItemActive ? 'var(--primary-blue)' : 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.95rem',
                      fontWeight: isItemActive ? '600' : '500',
                      boxShadow: isItemActive ? 'var(--shadow-md)' : 'none',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isItemActive) {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isItemActive) {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255, 255, 255, 0.7)';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && isSubmenuOpen && (
                  <div style={{
                    marginLeft: 'var(--spacing-md)',
                    marginTop: '4px',
                    paddingLeft: 'var(--spacing-md)',
                    borderLeft: '2px solid rgba(69, 182, 156, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'block',
                          paddingLeft: 'var(--spacing-md)',
                          paddingRight: 'var(--spacing-md)',
                          paddingTop: '8px',
                          paddingBottom: '8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          transition: 'all var(--transition-fast)',
                          backgroundColor: isActive(subitem.path) ? 'var(--white)' : 'transparent',
                          color: isActive(subitem.path) ? 'var(--primary-blue)' : 'rgba(255, 255, 255, 0.7)',
                          fontWeight: isActive(subitem.path) ? '600' : '400',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive(subitem.path)) {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive(subitem.path)) {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255, 255, 255, 0.7)';
                          }
                        }}
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
        <div style={{
          padding: 'var(--spacing-md)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <Link
            to="/settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              paddingLeft: 'var(--spacing-md)',
              paddingRight: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-sm)',
              paddingBottom: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
              fontSize: '0.95rem'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
            <span>Configurações</span>
          </Link>

          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              paddingLeft: 'var(--spacing-md)',
              paddingRight: 'var(--spacing-md)',
              paddingTop: 'var(--spacing-sm)',
              paddingBottom: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              color: 'rgba(255, 255, 255, 0.7)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(220, 53, 69, 0.3)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--white)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Shift */}
      <div style={{ display: 'none' }} className="lg:block lg:ml-64" />
    </>
  )
}
