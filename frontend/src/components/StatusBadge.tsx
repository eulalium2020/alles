import React from 'react'

export type StatusType = 'AGENDADO' | 'REALIZADO' | 'CANCELADO' | 'NAO_COMPARECEU'

interface StatusBadgeProps {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
  withIcon?: boolean
}

/**
 * 🎨 Componente de Badge de Status reutilizável com Design Healthcare
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', withIcon = true }) => {
  const statusConfig: Record<StatusType, { bg: string; color: string; borderColor: string; icon: string; label: string }> = {
    AGENDADO: {
      bg: '#D6EAF8',
      color: '#1A5276',
      borderColor: 'var(--info-blue)',
      icon: '🕐',
      label: 'Agendado',
    },
    REALIZADO: {
      bg: '#D5F4E6',
      color: '#0A5F3D',
      borderColor: 'var(--success-green)',
      icon: '✓',
      label: 'Realizado',
    },
    CANCELADO: {
      bg: '#FADBD8',
      color: '#78281F',
      borderColor: 'var(--error-red)',
      icon: '✕',
      label: 'Cancelado',
    },
    NAO_COMPARECEU: {
      bg: '#FCF3CF',
      color: '#7D6608',
      borderColor: 'var(--warning-yellow)',
      icon: '⚠️',
      label: 'Não Compareceu',
    },
  }

  const config = statusConfig[status]

  const sizeConfig = {
    sm: { padding: '4px 8px', fontSize: '0.75rem', gap: '4px', iconSize: '0.8rem' },
    md: { padding: '6px 12px', fontSize: '0.85rem', gap: '6px', iconSize: '0.95rem' },
    lg: { padding: '8px 16px', fontSize: '0.95rem', gap: '8px', iconSize: '1.1rem' },
  }

  const sizeStyle = sizeConfig[size]

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyle.gap,
        padding: sizeStyle.padding,
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: 'var(--radius-full)',
        border: `1.5px solid ${config.borderColor}`,
        fontWeight: '600',
        fontSize: sizeStyle.fontSize,
        transition: 'all var(--transition-fast)',
        cursor: 'default',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {withIcon && <span style={{ fontSize: sizeStyle.iconSize }}>{config.icon}</span>}
      {config.label}
    </div>
  )
}
