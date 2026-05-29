import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Lock, Mail, ArrowLeft } from 'lucide-react'
import { verifyAdmin, createAdminUser } from '../services/firestoreService'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Verificar admin en colección separada (sin tocar Firebase Auth)
      const result = await verifyAdmin(email, password)
      
      if (!result.success) {
        setError('Credenciales inválidas. Por favor intenta nuevamente.')
        return
      }
      
      // Guardar sesión de admin en localStorage (sin usar Firebase Auth)
      localStorage.setItem('adminEmail', email)
      localStorage.setItem('isAdminSession', 'true')
      
      // Redirigir al panel de admin
      navigate('/admin')
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <Shield className="h-12 w-12 text-emerald-500" />
            <span className="text-3xl font-bold text-white">AgroLink Admin</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white">
            Acceso Administrativo
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Ingresa tus credenciales de administrador
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-slate-700 bg-slate-800 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="admin@agrolink.dev"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-slate-700 bg-slate-800 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
            >
              Ingresar como Administrador
            </button>
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </div>
        </form>

        {/* Información de credenciales */}
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="font-semibold text-slate-300 mb-2">Credenciales de Administrador:</h3>
          <div className="text-sm text-slate-400 space-y-1">
            <p><strong>Email:</strong> admin@agrolink.dev</p>
            <p><strong>Contraseña:</strong> 123123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
