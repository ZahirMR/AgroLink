import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFarmers, addOrder } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, MapPin, Star, Truck, Banknote, QrCode, CreditCard, ArrowLeft, CheckCircle, Database, Package, AlertCircle } from 'lucide-react'

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dbConnected, setDbConnected] = useState(true)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    // Cargar carrito del localStorage
    const savedCart = localStorage.getItem('agrolink_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const farmersData = await getFarmers()
      setFarmers(farmersData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setDbConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const getDeliveryIcon = (method) => {
    switch(method) {
      case 'delivery': return <Truck className="h-4 w-4" />
      case 'pickup': return <MapPin className="h-4 w-4" />
      default: return null
    }
  }

  const getPaymentIcon = (method) => {
    switch(method) {
      case 'cash': return <Banknote className="h-4 w-4" />
      case 'qr': return <QrCode className="h-4 w-4" />
      case 'card': return <CreditCard className="h-4 w-4" />
      default: return null
    }
  }

  // Agrupar productos por agricultor
  const groupedByFarmer = cart.reduce((acc, product) => {
    if (!acc[product.farmerId]) {
      acc[product.farmerId] = []
    }
    acc[product.farmerId].push(product)
    return acc
  }, {})

  const calculateTotal = () => {
    let total = 0
    cart.forEach(product => {
      const quantity = product.quantity || 1
      total += product.price * quantity
    })
    // Agregar costo de delivery si es delivery
    if (selectedDeliveryMethod === 'delivery') {
      Object.keys(groupedByFarmer).forEach(farmerId => {
        const farmer = farmers.find(f => f.id === parseInt(farmerId))
        if (farmer && farmer.deliveryFee) {
          total += farmer.deliveryFee
        }
      })
    }
    return total
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Debes iniciar sesión para realizar un pedido')
      navigate('/login')
      return
    }

    if (!selectedPaymentMethod) {
      alert('Por favor selecciona un método de pago')
      return
    }

    if (!selectedDeliveryMethod) {
      alert('Por favor selecciona un método de entrega')
      return
    }

    try {
      setLoading(true)
      
      // Crear pedidos por agricultor
      const orderPromises = Object.keys(groupedByFarmer).map(async (farmerId) => {
        const farmerProducts = groupedByFarmer[farmerId]
        const farmer = farmers.find(f => f.id === parseInt(farmerId))
        
        const orderData = {
          customer: user.name || user.email,
          customerId: user.uid,
          farmerId: parseInt(farmerId),
          farmerName: farmer?.businessName || farmer?.name,
          products: farmerProducts.map(p => ({
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: p.quantity || 1,
            unit: p.unit
          })),
          total: farmerProducts.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0) + 
                 (selectedDeliveryMethod === 'delivery' ? (farmer?.deliveryFee || 0) : 0),
          paymentMethod: selectedPaymentMethod,
          deliveryMethod: selectedDeliveryMethod,
          deliveryFee: selectedDeliveryMethod === 'delivery' ? (farmer?.deliveryFee || 0) : 0,
          status: 'pending',
          date: new Date().toISOString(),
          createdAt: new Date()
        }
        
        return addOrder(orderData)
      })

      await Promise.all(orderPromises)
      
      // Limpiar carrito
      localStorage.removeItem('agrolink_cart')
      setCart([])
      setOrderPlaced(true)
      
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Error al realizar pedido:', error)
      alert('Error al realizar el pedido: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">Agrega productos para realizar tu pedido</p>
            <button
              onClick={() => navigate('/productos')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Ver Productos
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Realizado!</h2>
            <p className="text-gray-600 mb-6">Tu pedido ha sido enviado a los agricultores</p>
            <p className="text-sm text-gray-500">Serás redirigido a la página principal...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Database Status Indicator */}
      <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center ${
        dbConnected ? 'bg-green-500' : 'bg-red-500'
      } text-white`}>
        <Database className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          {dbConnected ? 'Base de Datos Conectada' : 'Sin Conexión'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/productos')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Productos
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Finalizar Pedido - Ventas por Mayor</h1>
          <p className="text-gray-600 mb-4">Revisa tu pedido antes de confirmar</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
            <Package className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Pedido por Mayor (B2B)</p>
              <p className="text-sm text-blue-700">Tu pedido incluye cantidades mínimas por producto para asegurar costos de entrega eficientes.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {Object.keys(groupedByFarmer).map(farmerId => {
                const farmerProducts = groupedByFarmer[farmerId]
                const farmer = farmers.find(f => f.id === parseInt(farmerId))
                const farmerTotal = farmerProducts.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0)
                
                return (
                  <div key={farmerId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Farmer Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{farmer?.businessName || farmer?.name}</h3>
                          <div className="flex items-center text-green-100">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{farmer?.zone}</span>
                            <Star className="h-4 w-4 ml-3 mr-1 text-yellow-400 fill-current" />
                            <span>{farmer?.rating || 4.5}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-100">Subtotal</p>
                          <p className="text-2xl font-bold">Bs. {farmerTotal}</p>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Productos</h4>
                      <div className="space-y-4">
                        {farmerProducts.map((product, idx) => (
                          <div key={idx} className="flex items-center justify-between pb-4 border-b last:border-0">
                            <div className="flex items-center">
                              {product.photoUrl ? (
                                <img src={product.photoUrl} alt={product.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                              ) : (
                                <span className="text-4xl mr-4">{product.image}</span>
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.description || product.category}</p>
                                <div className="flex items-center mt-1">
                                  <Package className="h-3 w-3 text-blue-600 mr-1" />
                                  <span className="text-xs text-blue-600 font-semibold">
                                    x{product.quantity || 1} {product.unit}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">Bs. {product.price * (product.quantity || 1)}</p>
                              <p className="text-sm text-gray-600">Bs. {product.price}/{product.unit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Truck className="h-5 w-5 mr-2 text-green-600" />
                            Métodos de Entrega
                          </h4>
                          <div className="space-y-2">
                            {farmer?.deliveryMethods?.map(method => (
                              <div key={method} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <div className="flex items-center">
                                  {getDeliveryIcon(method)}
                                  <span className="ml-2 font-medium">
                                    {method === 'delivery' ? 'Delivery' : 'Recoger'}
                                  </span>
                                </div>
                                {method === 'delivery' && farmer.deliveryFee > 0 && (
                                  <span className="text-green-600 font-semibold">+Bs. {farmer.deliveryFee}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Banknote className="h-5 w-5 mr-2 text-green-600" />
                            Métodos de Pago
                          </h4>
                          <div className="space-y-2">
                            {farmer?.paymentMethods?.map(method => (
                              <div key={method} className="flex items-center p-3 bg-white rounded-lg border">
                                {getPaymentIcon(method)}
                                <span className="ml-2 font-medium">
                                  {method === 'cash' ? 'Efectivo' : method === 'qr' ? 'QR' : 'Tarjeta'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h3>
                
                {/* Delivery Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Entrega
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedDeliveryMethod('pickup')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition ${
                        selectedDeliveryMethod === 'pickup'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>Recoger</span>
                      </div>
                      <span className="text-green-600 font-semibold">Gratis</span>
                    </button>
                    <button
                      onClick={() => setSelectedDeliveryMethod('delivery')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition ${
                        selectedDeliveryMethod === 'delivery'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <Truck className="h-5 w-5 mr-2" />
                        <span>Delivery</span>
                      </div>
                      <span className="text-green-600 font-semibold">
                        +Bs. {Object.keys(groupedByFarmer).reduce((sum, farmerId) => {
                          const farmer = farmers.find(f => f.id === parseInt(farmerId))
                          return sum + (farmer?.deliveryFee || 0)
                        }, 0)}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedPaymentMethod('cash')}
                      className={`w-full flex items-center p-3 rounded-lg border transition ${
                        selectedPaymentMethod === 'cash'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Banknote className="h-5 w-5 mr-2" />
                      <span>Efectivo</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('qr')}
                      className={`w-full flex items-center p-3 rounded-lg border transition ${
                        selectedPaymentMethod === 'qr'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <QrCode className="h-5 w-5 mr-2" />
                      <span>QR</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('card')}
                      className={`w-full flex items-center p-3 rounded-lg border transition ${
                        selectedPaymentMethod === 'card'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      <span>Tarjeta</span>
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">Bs. {cart.reduce((sum, p) => sum + p.price, 0)}</span>
                  </div>
                  {selectedDeliveryMethod === 'delivery' && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-semibold">Bs. {Object.keys(groupedByFarmer).reduce((sum, farmerId) => {
                        const farmer = farmers.find(f => f.id === parseInt(farmerId))
                        return sum + (farmer?.deliveryFee || 0)
                      }, 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-600">Bs. {calculateTotal()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedPaymentMethod || !selectedDeliveryMethod || loading}
                  className="w-full mt-6 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Al confirmar, tu pedido será enviado directamente a los agricultores.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout
