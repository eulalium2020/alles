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
  const colorClasses = {
    blue: 'hover:shadow-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    green: 'hover:shadow-green-300 bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    purple: 'hover:shadow-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
    neutral: 'hover:shadow-gray-300 bg-white border-gray-200',
  }

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all ${
        isClickable ? 'cursor-pointer' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {icon && <div className="text-2xl mt-1">{icon}</div>}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>
        {isClickable && <span className="text-gray-400 text-xl">›</span>}
      </div>

      {/* Content */}
      {children && <div className="mb-4 text-gray-700">{children}</div>}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {actions.map((action) => {
            const actionColorClasses = {
              blue: 'bg-blue-500 hover:bg-blue-600 text-white',
              red: 'bg-red-500 hover:bg-red-600 text-white',
              green: 'bg-green-500 hover:bg-green-600 text-white',
            }

            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition ${
                  actionColorClasses[action.color || 'blue']
                }`}
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
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    green: 'from-green-50 to-green-100 border-green-200 text-green-700',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-700',
  }

  return (
    <div className={`bg-gradient-to-br ${colorConfig[color]} border rounded-lg p-6 shadow-md hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm font-semibold mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-4xl opacity-20">{icon}</div>}
      </div>
    </div>
  )
}
