import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, ArrowLeft, Edit } from 'lucide-react'
import { getOrders } from '../services/firestoreService'

function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadOrders()
  }, [user, navigate])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const ordersData = await getOrders()
      // Filtrar pedidos del usuario actual
      const userOrders = ordersData.filter(order => order.customerId === user.uid)
      setOrders(userOrders)
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Información de tu cuenta y pedidos</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-green-600" />
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">{user.name || 'Usuario'}</h2>
                <p className="text-green-100">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Tipo de Usuario</p>
                  <p className="font-semibold capitalize">{user.userType || 'Cliente'}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Miembro desde</p>
                  <p className="font-semibold">{new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total de Pedidos</p>
                  <p className="font-semibold">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-green-600" />
            Mis Pedidos
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tienes pedidos aún</p>
              <button
                onClick={() => navigate('/productos')}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{order.farmerName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()} - {order.products.length} productos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">Bs. {order.total}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'pending' ? 'Pendiente' :
                         order.status === 'completed' ? 'Completado' :
                         order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Método de pago: {order.paymentMethod === 'cash' ? 'Efectivo' : order.paymentMethod === 'qr' ? 'QR' : 'Tarjeta'}</p>
                    <p>Método de entrega: {order.deliveryMethod === 'delivery' ? 'Delivery' : 'Recoger'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
