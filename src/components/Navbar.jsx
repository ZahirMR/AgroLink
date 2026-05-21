import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, User, LayoutDashboard, LogOut, LogIn } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="AgroLink Logo" className="h-10 w-10" />
              <span className="text-xl font-bold">AgroLink</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition">
                Inicio
              </Link>
              <Link to="/productos" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition">
                Productos
              </Link>
              {user && (
                <Link to="/pedidos" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition">
                  Mis Pedidos
                </Link>
              )}
              {user && user.userType === 'farmer' && (
                <Link to="/agricultor" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Agricultor
                </Link>
              )}
              {user && user.email.includes('admin') && (
                <Link to="/admin" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition flex items-center">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Cerrar Sesión
                </button>
              ) : (
                <Link to="/login" className="hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition flex items-center">
                  <LogIn className="h-4 w-4 mr-1" />
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
