import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFarmers, getProducts } from '../services/firestoreService'
import { ShoppingCart, MapPin, Star, Truck, Clock, CreditCard, QrCode, Banknote } from 'lucide-react'

function Home() {
  const [farmers, setFarmers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [farmersData, productsData] = await Promise.all([
        getFarmers(),
        getProducts()
      ])
      setFarmers(farmersData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img src="/logo.png" alt="AgroLink Logo" className="h-24 w-24 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">AgroLink</h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">Del campo a tu mesa, sin intermediarios</p>
            <p className="text-lg opacity-80 mb-8">Compra directamente a agricultores locales. Precios justos, productos frescos.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/productos" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ver Productos
              </Link>
              <Link to="/register" className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition">
                Soy Agricultor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-green-600">{farmers.length}+</p>
              <p className="text-gray-600">Agricultores</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{products.length}+</p>
              <p className="text-gray-600">Productos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">100%</p>
              <p className="text-gray-600">Fresco</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">0%</p>
              <p className="text-gray-600">Intermediarios</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Featured Farmers Section */}
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestros Agricultores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmers.map(farmer => (
                  <div key={farmer.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                      <h3 className="text-2xl font-bold text-white">{farmer.businessName || farmer.name}</h3>
                      <p className="text-green-100">{farmer.name}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-white font-semibold">{farmer.rating || 4.5}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{farmer.zone}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{farmer.description || 'Productos frescos de calidad'}</p>
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Métodos de entrega:</p>
                        <div className="flex gap-2 mb-3">
                          {farmer.deliveryMethods?.map(method => (
                            <span key={method} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                              {getDeliveryIcon(method)}
                              <span className="ml-1">{method === 'delivery' ? 'Delivery' : 'Recoger'}</span>
                            </span>
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Métodos de pago:</p>
                        <div className="flex gap-2">
                          {farmer.paymentMethods?.map(method => (
                            <span key={method} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                              {getPaymentIcon(method)}
                              <span className="ml-1">{method === 'cash' ? 'Efectivo' : method === 'qr' ? 'QR' : 'Tarjeta'}</span>
                            </span>
                          ))}
                        </div>
                        {farmer.deliveryFee > 0 && (
                          <p className="text-sm text-green-600 font-semibold mt-3">Delivery: Bs. {farmer.deliveryFee}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Products Section */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
                <Link to="/productos" className="text-green-600 hover:text-green-700 font-semibold">
                  Ver todos →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map(product => {
                  const farmer = farmers.find(f => f.id === product.farmerId)
                  return (
                    <div key={product.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition">
                      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        {product.photoUrl ? (
                          <img src={product.photoUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-7xl">{product.image}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-green-600 font-semibold mb-1">{farmer?.businessName || farmer?.name}</p>
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description || product.category}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-green-600">Bs. {product.price}</span>
                            <span className="text-sm text-gray-600">/{product.unit}</span>
                          </div>
                          <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition">
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Eres agricultor?</h2>
          <p className="text-xl mb-8 opacity-90">Únete a AgroLink y vende tus productos directamente a clientes, sin intermediarios</p>
          <Link to="/register" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Registrarse Gratis
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
