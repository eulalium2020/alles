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
import { MainLayout } from '@layouts/MainLayout'
import { useIsAuthenticated } from '@store/authStore'
import './index.css'

/**
 * 🛡️ Componente para proteger rotas privadas
 */
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
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

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
