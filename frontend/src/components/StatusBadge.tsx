import React from 'react'

export type StatusType = 'AGENDADO' | 'REALIZADO' | 'CANCELADO' | 'NAO_COMPARECEU'

interface StatusBadgeProps {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
  withIcon?: boolean
}

/**
 * 🎨 Componente de Badge de Status reutilizável
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', withIcon = true }) => {
  const statusConfig: Record<StatusType, { bg: string; text: string; icon: string; label: string }> = {
    AGENDADO: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: '🕐',
      label: 'Agendado',
    },
    REALIZADO: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: '✓',
      label: 'Realizado',
    },
    CANCELADO: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: '✕',
      label: 'Cancelado',
    },
    NAO_COMPARECEU: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: '⚠️',
      label: 'Não Compareceu',
    },
  }

  const config = statusConfig[status]

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div className={`inline-flex items-center gap-2 ${config.bg} ${config.text} rounded-full font-semibold ${sizeClasses[size]} transition-transform hover:scale-105`}>
      {withIcon && <span>{config.icon}</span>}
      {config.label}
    </div>
  )
}
