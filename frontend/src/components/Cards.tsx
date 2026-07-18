import React from 'react'

interface InfoCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children?: React.ReactNode
  actions?: Array<{
    label: string
    onClick: () => void
    color?: 'blue' | 'red' | 'green'
    icon?: React.ReactNode
  }>
  onClick?: () => void
  isClickable?: boolean
}

/**
 * 🎨 Card informativo com layout limpo e ações
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  actions,
  onClick,
  isClickable = false,
}) => {
  return (
    <div
      onClick={isClickable ? onClick : undefined}
      style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
        cursor: isClickable ? 'pointer' : 'default'
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)', flex: 1 }}>
          {icon && <div style={{ fontSize: '1.5rem', marginTop: '4px' }}>{icon}</div>}
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--primary-blue)',
              marginBottom: '4px'
            }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--gray-medium)',
                marginTop: '4px'
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {isClickable && <span style={{ color: 'var(--gray-medium)', fontSize: '1.2rem' }}>›</span>}
      </div>

      {/* Content */}
      {children && (
        <div style={{
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-dark)'
        }}>
          {children}
        </div>
      )}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          paddingTop: 'var(--spacing-md)',
          borderTop: '1px solid var(--border-color)'
        }}>
          {actions.map((action) => {
            const actionColorClasses = {
              blue: {
                backgroundColor: 'var(--primary-blue)',
                color: 'var(--white)',
                hover: '#084A6E'
              },
              red: {
                backgroundColor: 'var(--error-red)',
                color: 'var(--white)',
                hover: '#C0392B'
              },
              green: {
                backgroundColor: 'var(--success-green)',
                color: 'var(--white)',
                hover: '#1E8449'
              },
            }

            const colors = actionColorClasses[action.color || 'blue']

            return (
              <button
                key={action.label}
                onClick={action.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  paddingLeft: 'var(--spacing-md)',
                  paddingRight: 'var(--spacing-md)',
                  paddingTop: 'var(--spacing-sm)',
                  paddingBottom: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all var(--transition-fast)',
                  backgroundColor: colors.backgroundColor,
                  color: colors.color,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.hover;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-md)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.backgroundColor;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-sm)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                {action.icon}
                {action.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * 🎨 Estatística Card
 */
interface StatCardProps {
  label: string
  value: string | number
  trend?: { value: number; isPositive: boolean }
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, color = 'blue' }) => {
  const colorConfig = {
    blue: {
      background: 'linear-gradient(135deg, var(--primary-blue), #084A6E)',
      text: 'var(--white)'
    },
    green: {
      background: 'linear-gradient(135deg, var(--success-green), #1E8449)',
      text: 'var(--white)'
    },
    teal: {
      background: 'linear-gradient(135deg, var(--secondary-teal), #389680)',
      text: 'var(--white)'
    },
    orange: {
      background: 'linear-gradient(135deg, var(--warning-yellow), #E67E22)',
      text: 'var(--white)'
    },
  }

  const config = colorConfig[color as keyof typeof colorConfig] || colorConfig.blue

  return (
    <div
      style={{
        background: config.background,
        color: config.text,
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition-fast)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: '0.9rem',
          fontWeight: '500',
          marginBottom: '4px',
          opacity: 0.9
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: 'var(--spacing-sm)',
          fontFamily: 'var(--font-headings)'
        }}>
          {value}
        </p>
        {trend && (
          <p style={{
            fontSize: '0.85rem',
            fontWeight: '600',
            marginTop: 'var(--spacing-sm)',
            color: trend.isPositive ? '#90EE90' : '#FFB6C1'
          }}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
      {icon && (
        <div style={{
          fontSize: '3rem',
          opacity: 0.15
        }}>
          {icon}
        </div>
      )}
    </div>
  )
}
