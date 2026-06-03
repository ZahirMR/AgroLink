import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, User, LayoutDashboard, LogOut, LogIn, Facebook, Instagram, Twitter, Linkedin, Menu, X, Heart, Leaf } from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/30 transition">
                <img src="/logo.jpeg" alt="AgroLink" className="h-8 w-8 object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tight">AgroLink</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              <Link to="/" className="hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center">
                Inicio
              </Link>
              <Link to="/productos" className="hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center">
                Productos
              </Link>
              {user && (
                <Link to="/pedidos" className="hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center">
                  Mis Pedidos
                </Link>
              )}
              {user && (
                <Link to="/perfil" className="hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </Link>
              )}
              {user && user.userType === 'farmer' && (
                <Link to="/agricultor" className="hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Panel Agricultor
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </button>
              ) : (
                <Link to="/login" className="bg-white text-green-700 px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition flex items-center shadow-lg">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              )}
              
              {/* Social Media Icons */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-white/20">
                <a href="#" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="bg-pink-600 p-2 rounded-lg hover:bg-pink-700 transition">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="bg-sky-500 p-2 rounded-lg hover:bg-sky-600 transition">
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/20 transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-800/95 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" className="block hover:bg-white/20 px-4 py-3 rounded-xl text-sm font-medium transition">
              Inicio
            </Link>
            <Link to="/productos" className="block hover:bg-white/20 px-4 py-3 rounded-xl text-sm font-medium transition">
              Productos
            </Link>
            {user && (
              <Link to="/pedidos" className="block hover:bg-white/20 px-4 py-3 rounded-xl text-sm font-medium transition">
                Mis Pedidos
              </Link>
            )}
            {user && (
              <Link to="/perfil" className="block hover:bg-white/20 px-4 py-3 rounded-xl text-sm font-medium transition flex items-center">
                <User className="h-4 w-4 mr-2" />
                Mi Perfil
              </Link>
            )}
            {user && user.userType === 'farmer' && (
              <Link to="/agricultor" className="block hover:bg-white/20 px-4 py-3 rounded-xl text-sm font-medium transition flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Panel Agricultor
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left hover:bg-white/20 px-4 py-3 rounded-xl text-sm font-medium transition flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            ) : (
              <Link to="/login" className="block bg-white text-green-700 px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition text-center">
                Iniciar Sesión
              </Link>
            )}
            
            {/* Mobile Social Media */}
            <div className="flex items-center space-x-3 pt-4 border-t border-white/20">
              <a href="#" className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-pink-600 p-3 rounded-xl hover:bg-pink-700 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-sky-500 p-3 rounded-xl hover:bg-sky-600 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-700 p-3 rounded-xl hover:bg-blue-800 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
