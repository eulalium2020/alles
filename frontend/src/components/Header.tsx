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
    <header 
      style={{
        backgroundColor: 'var(--white)',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-lg) var(--spacing-xl)',
        gap: 'var(--spacing-lg)',
        maxWidth: '100%'
      }}>
        {/* Left: Search */}
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: 'var(--spacing-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.2rem',
              color: 'var(--gray-medium)'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar pacientes, atendimentos..."
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                paddingRight: 'var(--spacing-md)',
                paddingTop: 'var(--spacing-sm)',
                paddingBottom: 'var(--spacing-sm)',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-main)',
                transition: 'all var(--transition-fast)',
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = 'var(--primary-blue)';
                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(10, 105, 146, 0.1)';
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = 'var(--border-color)';
                (e.target as HTMLInputElement).style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Right: Notifications & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
          {/* Notifications */}
          <button 
            style={{
              position: 'relative',
              padding: 'var(--spacing-sm)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.3rem',
              transition: 'all var(--transition-fast)',
              borderRadius: 'var(--radius-sm)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--light-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            🔔
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--error-red)',
              borderRadius: '50%',
              display: 'inline-block'
            }} />
          </button>

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '24px',
            backgroundColor: 'var(--border-color)'
          }} />

          {/* User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, var(--primary-blue), #084A6E)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontWeight: '600',
                fontSize: '0.9rem',
                flexShrink: 0,
                boxShadow: 'var(--shadow-sm)'
              }}>
                {getInitials(usuario?.nome)}
              </div>
              <div style={{ display: 'none' }} className="sm:block">
                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                  {usuario?.nome || 'Usuário'}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-medium)', marginTop: '2px' }}>
                  {usuario?.perfil}
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div style={{ position: 'relative', group: 'hover' }}>
              <button 
                style={{
                  padding: 'var(--spacing-sm)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  transition: 'all var(--transition-fast)',
                  borderRadius: 'var(--radius-sm)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--light-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                ⌄
              </button>

              {/* Dropdown Content */}
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: 'var(--spacing-md)',
                width: '220px',
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                opacity: 0,
                visibility: 'hidden',
                transition: 'all var(--transition-fast)',
                zIndex: 50
              }}
                className="group-hover:opacity-100 group-hover:visible"
              >
                <div style={{
                  padding: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                    {usuario?.email}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-medium)', marginTop: '4px' }}>
                    {usuario?.perfil}
                  </p>
                </div>

                <div style={{ paddingTop: 'var(--spacing-sm)', paddingBottom: 'var(--spacing-sm)' }}>
                  <button 
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      paddingLeft: 'var(--spacing-md)',
                      paddingRight: 'var(--spacing-md)',
                      paddingTop: 'var(--spacing-sm)',
                      paddingBottom: 'var(--spacing-sm)',
                      fontSize: '0.95rem',
                      color: 'var(--text-dark)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--light-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    👤 Meu Perfil
                  </button>

                  <div style={{
                    paddingLeft: 'var(--spacing-md)',
                    paddingRight: 'var(--spacing-md)',
                    paddingTop: 'var(--spacing-sm)',
                    paddingBottom: 'var(--spacing-sm)',
                    borderTop: '1px solid var(--border-color)',
                    marginTop: 'var(--spacing-sm)'
                  }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        fontSize: '0.95rem',
                        color: 'var(--error-red)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FADBD8')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
