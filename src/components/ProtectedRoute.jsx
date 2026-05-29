import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children, requireAdmin = false, requireFarmer = false, requireClient = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Verificar si es una sesión de admin
  const isAdminSession = localStorage.getItem('isAdminSession')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // --- Rutas de admin ---
  // Si estamos en una ruta /admin, solo permitir si hay sesión de admin activa
  if (location.pathname.startsWith('/admin')) {
    if (isAdminSession) return children
    return <Navigate to="/admin-login" replace />
  }

  // --- Rutas de agricultor / cliente ---
  // La sesión de admin NO bloquea al agricultor ni al cliente.
  // Si el usuario tiene una sesión normal activa, dejarle pasar.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si el usuario registrado en Firebase es admin, enviarlo al panel admin
  if (user.userType === 'admin') {
    return <Navigate to="/admin-login" replace />
  }

  // Verificar tipos de usuario requeridos
  if (requireFarmer && user.userType !== 'farmer') {
    return <Navigate to="/" replace />
  }

  if (requireClient && user.userType !== 'client') {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && user.userType !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
