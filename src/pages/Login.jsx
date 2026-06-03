import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf, Lock, Mail, Shield } from 'lucide-react'
import { updateUserType, createAdminUser } from '../services/firestoreService'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      
      if (user && user.userType === 'admin') {
        window.location.href = '/admin'
      } else if (user && user.userType === 'farmer') {
        window.location.href = '/agricultor'
      } else {
        navigate('/')
      }
    } catch (error) {
      setError('Credenciales inválidas. Por favor intenta nuevamente.')
    }
  }

  const handleSetupAdmin = async () => {
    if (window.confirm('¿Crear usuario admin@agrolink.dev / 123123 en la base de datos?')) {
      try {
        await createAdminUser('admin@agrolink.dev', '123123')
        alert('Usuario admin creado exitosamente en la base de datos. Ahora puedes iniciar sesión en /admin-login')
      } catch (error) {
        alert('Error al crear usuario admin: ' + error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <img src="/logo.jpeg" alt="AgroLink" className="h-12 w-12 object-contain" />
            <span className="text-3xl font-bold text-primary-600">AgroLink</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa para acceder a tu cuenta
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-primary-600 hover:text-primary-500">
              ← Volver al inicio
            </Link>
          </div>
        </form>

        {/* Enlace a login de administrador */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600 mb-2">¿Eres administrador?</p>
          <Link to="/admin-login" className="text-sm font-medium text-slate-900 hover:text-slate-700">
            Acceder al panel de administración
          </Link>
        </div>

        {/* Botón para configurar admin en Firestore */}
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <button
            onClick={handleSetupAdmin}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
          >
            <Shield className="h-5 w-5 mr-2" />
            Configurar Usuario Admin en Firestore
          </button>
          <p className="text-xs text-purple-700 mt-2 text-center">Solo para desarrollo - configura admin@agrolink.dev como admin</p>
        </div>
      </div>
    </div>
  )
}

export default Login
