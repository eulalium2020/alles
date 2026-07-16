import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useUsuario, useCanAccess } from '@store/authStore'
import { useAuth } from '@hooks/useAuth'
import { ROLES } from '@constants/api'
import { profissionalService } from '@services/profissionalService'
import { pacienteService } from '@services/pacienteService'
import { relatorioService } from '@services/relatorioService'
import { RelatorioMensal, DashboardStats } from '@/types'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const PIE_COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']

/**
 * 📊 Página Dashboard com dados reais e gráficos
 */
export const DashboardPage: React.FC = () => {
  const usuario = useUsuario()
  const canAccess = useCanAccess()
  const { logout } = useAuth()

  const isAdmin = canAccess([ROLES.ADMIN, ROLES.GERENTE])
  const isProfissional = usuario?.perfil === ROLES.PROFISSIONAL

  const [stats, setStats] = useState<DashboardStats>({
    totalProfissionais: 0,
    totalPacientes: 0,
    atendimentosMes: 0,
    receitaMes: 0,
  })
  const [chartData, setChartData] = useState<{ mes: string; atendimentos: number; receita: number }[]>([])
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const now = new Date()
        const mesList = Array.from({ length: 6 }, (_, i) => subMonths(now, 5 - i))
        const [profResp, pacResp] = await Promise.allSettled([
          profissionalService.getAll(0, 1),
          pacienteService.getAll(0, 1),
        ])

        const totalProfissionais =
          profResp.status === 'fulfilled' ? profResp.value.totalElements : 0
        const totalPacientes =
          pacResp.status === 'fulfilled' ? pacResp.value.totalElements : 0

        if (isAdmin) {
          const relatorios6m = await Promise.allSettled(
            mesList.map((d) => relatorioService.getGerencial(format(d, 'yyyy-MM'))),
          )

          const chart = mesList.map((d, i) => {
            const rel = relatorios6m[i]
            const data: RelatorioMensal[] =
              rel.status === 'fulfilled' ? rel.value : []
            const atendimentos = data.reduce((s, r) => s + (r.total_atendimentos || 0), 0)
            const receita = data.reduce((s, r) => s + (Number(r.receita) || 0), 0)
            return {
              mes: format(d, 'MMM', { locale: ptBR }),
              atendimentos,
              receita,
            }
          })
          setChartData(chart)

          const mesAtualData = relatorios6m[5]
          const mesAtualRel: RelatorioMensal[] =
            mesAtualData.status === 'fulfilled' ? mesAtualData.value : []
          const atendimentosMes = mesAtualRel.reduce((s, r) => s + (r.total_atendimentos || 0), 0)
          const atendimentosRealizados = mesAtualRel.reduce(
            (s, r) => s + (r.atendimentos_realizados || 0),
            0,
          )
          const receitaMes = mesAtualRel.reduce((s, r) => s + (Number(r.receita) || 0), 0)

          setStats({ totalProfissionais, totalPacientes, atendimentosMes, receitaMes })
          setPieData([
            { name: 'Realizados', value: atendimentosRealizados },
            { name: 'Agendados', value: Math.max(0, atendimentosMes - atendimentosRealizados) },
          ])
        } else {
          setStats({ totalProfissionais, totalPacientes, atendimentosMes: 0, receitaMes: 0 })
        }
      } catch {
        // silenciar — dados mostram zeros em caso de falha
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [isAdmin])

  return (
    <div className="min-h-screen bg-gray-100">
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
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {isAdmin && (
            <>
              <StatCard
                label="Profissionais"
                value={loading ? '...' : String(stats.totalProfissionais)}
                color="text-blue-600"
                icon="👨‍⚕️"
              />
              <StatCard
                label="Pacientes"
                value={loading ? '...' : String(stats.totalPacientes)}
                color="text-purple-600"
                icon="👥"
              />
            </>
          )}
          <StatCard
            label="Atendimentos (mês)"
            value={loading ? '...' : String(stats.atendimentosMes)}
            color="text-green-600"
            icon="📅"
          />
          {isAdmin && (
            <StatCard
              label="Receita (mês)"
              value={loading ? '...' : `R$ ${stats.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              color="text-emerald-600"
              icon="💰"
            />
          )}
        </div>

        {/* Charts — admin only */}
        {isAdmin && !loading && chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Bar chart: atendimentos últimos 6 meses */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-700">
                Atendimentos — últimos 6 meses
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="atendimentos" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Atendimentos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart: status do mês atual */}
            {pieData.some((d) => d.value > 0) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Status — mês atual</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }: { name?: string; percent?: number }) =>
                        `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isAdmin && (
              <>
                <QuickLink to="/profissionais" icon="👨‍⚕️" label="Profissionais" />
                <QuickLink to="/pacientes" icon="👥" label="Pacientes" />
                <QuickLink to="/relatorios" icon="📊" label="Relatórios" />
              </>
            )}
            {(isAdmin || isProfissional) && (
              <QuickLink to="/atendimentos" icon="📅" label="Atendimentos" />
            )}
            <QuickLink to="/planos-saude" icon="🏥" label="Planos de Saúde" />
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: string
  color: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}

function QuickLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link to={to} className="block p-4 border rounded hover:bg-blue-50 transition text-center">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </Link>
  )
}

