import { useState, useEffect } from 'react'
import { getUsers, getFarmers, getProducts, getOrders } from '../services/firestoreService'
import { Users, BarChart3, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Admin() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  
  const [users, setUsers] = useState([])
  const [farmers, setFarmers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, farmersData, productsData, ordersData] = await Promise.all([
        getUsers(),
        getFarmers(),
        getProducts(),
        getOrders()
      ])
      setUsers(usersData)
      setFarmers(farmersData)
      setProducts(productsData)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const clientCount = users.filter(u => u.userType === 'client').length
  const farmerUserCount = users.filter(u => u.userType === 'farmer').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-gray-300">Gestión de usuarios y estadísticas</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Usuarios</p>
                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-gray-200" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Clientes</p>
                    <p className="text-3xl font-bold text-blue-600">{clientCount}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-200" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Agricultores</p>
                    <p className="text-3xl font-bold text-green-600">{farmerUserCount}</p>
                  </div>
                  <Users className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Productos</p>
                    <p className="text-3xl font-bold text-purple-600">{products.length}</p>
                  </div>
                  <BarChart3 className="h-12 w-12 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Users Section */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Usuarios Registrados</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Nombre</th>
                        <th className="text-left py-3 px-4">Tipo</th>
                        <th className="text-left py-3 px-4">Fecha de Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.name || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.userType === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.userType === 'farmer' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.userType === 'admin' ? 'Administrador' :
                               user.userType === 'farmer' ? 'Agricultor' : 'Cliente'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Farmers Section */}
            <div className="bg-white rounded-xl shadow-sm mt-8">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Perfiles de Agricultores</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Negocio</th>
                        <th className="text-left py-3 px-4">Nombre</th>
                        <th className="text-left py-3 px-4">Zona</th>
                        <th className="text-left py-3 px-4">Rating</th>
                        <th className="text-left py-3 px-4">Productos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {farmers.map(farmer => {
                        const farmerProducts = products.filter(p => p.farmerId === farmer.id)
                        return (
                          <tr key={farmer.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold">{farmer.businessName || '-'}</td>
                            <td className="py-3 px-4">{farmer.name}</td>
                            <td className="py-3 px-4">{farmer.zone}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1">{farmer.rating || 4.5}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{farmerProducts.length}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Admin
