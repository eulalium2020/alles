import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { LoginPage } from '@pages/LoginPage'
import { DashboardPage } from '@pages/DashboardPage'
import { ProfissionaisPage } from '@pages/ProfissionaisPage'
import { PacientesPage } from '@pages/PacientesPage'
import { AtendimentosPage } from '@pages/AtendimentosPage'
import { PlanosSaudePage } from '@pages/PlanosSaudePage'
import { UsuariosPage } from '@pages/UsuariosPage'
import { MainLayout } from './layouts/MainLayout'
import { ThemeToggle } from '@components/ThemeToggle'
import { useCanAccess, useIsAuthenticated } from '@store/authStore'
import { ROLES } from '@constants/api'
import { Perfil } from '@/types'
import './index.css'

/**
 * 🛡️ Componente para proteger rotas privadas
 */
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: Perfil[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const isAuthenticated = useIsAuthenticated()
  const canAccess = useCanAccess()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && requiredRoles.length > 0 && !canAccess(requiredRoles)) {
    return <Navigate to="/dashboard" replace />
  }

  return <MainLayout>{children}</MainLayout>
}

/**
 * 🎯 Componente principal da aplicação
 */
function App() {
  useEffect(() => {
    // Verificar autenticação ao carregar
    const token = localStorage.getItem('alles_access_token')
    if (!token) {
      // Redirecionar para login se não houver token
    }
  }, [])

  return (
    <Router>
      {/* Theme Toggle Button */}
      <ThemeToggle />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard by default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/profissionais"
          element={
            <ProtectedRoute>
              <ProfissionaisPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <PacientesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/atendimentos"
          element={
            <ProtectedRoute>
              <AtendimentosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/planos-saude"
          element={
            <ProtectedRoute>
              <PlanosSaudePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <UsuariosPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
