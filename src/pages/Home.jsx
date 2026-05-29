import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFarmers, getProducts } from '../services/firestoreService'
import { ShoppingCart, MapPin, Star, Truck, Clock, CreditCard, QrCode, Banknote, Heart, Facebook, Instagram, Twitter, Linkedin, Leaf, Users, TrendingUp, Award, Shield, Zap, Globe, MessageCircle, Phone, Mail } from 'lucide-react'

function Home() {
  const [farmers, setFarmers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    loadData()
    loadFavorites()
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

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const toggleFavorite = (productId) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Leaf className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">AgroLink</h1>
            <p className="text-2xl md:text-3xl mb-4 opacity-90 font-light">Del campo a tu mesa, sin intermediarios</p>
            <p className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto">
              Conectamos directamente a agricultores locales con consumidores. Precios justos, productos frescos, y apoyo a la economía local.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/productos" className="bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ver Productos
              </Link>
              <Link to="/register" className="bg-green-800/50 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-800/70 transition transform hover:scale-105">
                Soy Agricultor
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm opacity-75">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                <span>Calidad Garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 shadow-lg relative -mt-8 mx-4 md:mx-8 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-green-600">{farmers.length}+</p>
              <p className="text-gray-600 font-medium">Agricultores</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-emerald-100 p-3 rounded-full group-hover:bg-emerald-200 transition">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-emerald-600">{products.length}+</p>
              <p className="text-gray-600 font-medium">Productos</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-teal-100 p-3 rounded-full group-hover:bg-teal-200 transition">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-teal-600">100%</p>
              <p className="text-gray-600 font-medium">Fresco</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-green-600">0%</p>
              <p className="text-gray-600 font-medium">Intermediarios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestra Visión y Misión</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformamos la forma en que las comunidades acceden a alimentos frescos y locales
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser la plataforma líder que conecta directamente a agricultores con consumidores, eliminando intermediarios y creando un ecosistema alimentario más justo, sostenible y accesible para todos. Visualizamos un futuro donde cada comunidad tenga acceso a alimentos frescos, locales y de calidad, mientras los agricultores reciben el valor justo por su trabajo.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 leading-relaxed">
                Facilitar el comercio directo entre agricultores y consumidores a través de tecnología innovadora, garantizando precios justos, productos frescos y un impacto positivo en las comunidades locales. Nos comprometemos a empoderar a los agricultores, informar a los consumidores y promover prácticas agrícolas sostenibles.
              </p>
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
          <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Agricultores</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Conoce a los productores locales que trabajan duro para traerte los mejores productos
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {farmers.map(farmer => (
                  <div key={farmer.id} className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 border border-green-100">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="relative">
                        <h3 className="text-2xl font-bold text-white mb-1">{farmer.businessName || farmer.name}</h3>
                        <p className="text-green-100 mb-3">{farmer.name}</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-white font-semibold">{farmer.rating || 4.5}</span>
                          <span className="ml-2 text-green-200 text-sm">({Math.floor(Math.random() * 50) + 10} reseñas)</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-medium">{farmer.zone}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{farmer.description || 'Productos frescos de calidad, cultivados con amor y dedicación.'}</p>
                      <div className="border-t border-green-100 pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Métodos de entrega:</p>
                        <div className="flex gap-2 mb-3">
                          {farmer.deliveryMethods?.map(method => (
                            <span key={method} className="flex items-center text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                              {getDeliveryIcon(method)}
                              <span className="ml-1">{method === 'delivery' ? 'Delivery' : 'Recoger'}</span>
                            </span>
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Métodos de pago:</p>
                        <div className="flex gap-2">
                          {farmer.paymentMethods?.map(method => (
                            <span key={method} className="flex items-center text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
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
          <div className="py-20 bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">Productos Destacados</h2>
                  <p className="text-gray-600">Los mejores productos de nuestros agricultores</p>
                </div>
                <Link to="/productos" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center shadow-lg">
                  Ver todos
                  <ShoppingCart className="h-4 w-4 ml-2" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map(product => {
                  const farmer = farmers.find(f => f.id === product.farmerId)
                  const isFavorite = favorites.includes(product.id)
                  return (
                    <div key={product.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 border border-gray-100 group">
                      <div className="relative h-56 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center overflow-hidden">
                        {product.photoUrl ? (
                          <img src={product.photoUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                        ) : (
                          <span className="text-8xl">{product.image}</span>
                        )}
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-md"
                        >
                          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                        <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-green-600 font-semibold mb-1 flex items-center">
                          <Leaf className="h-3 w-3 mr-1" />
                          {farmer?.businessName || farmer?.name}
                        </p>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description || product.category}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-green-600">Bs. {product.price}</span>
                            <span className="text-sm text-gray-600">/{product.unit}</span>
                          </div>
                          <button className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl">
                            <ShoppingCart className="h-5 w-5" />
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

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir AgroLink?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beneficios para consumidores y agricultores
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center hover:shadow-xl transition">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Precios Justos</h3>
              <p className="text-gray-600">Sin intermediarios, los agricultores reciben mejor precio y los consumidores pagan menos</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center hover:shadow-xl transition">
              <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Fresco</h3>
              <p className="text-gray-600">Productos directos del campo, cosechados al momento y entregados rápidamente</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 text-center hover:shadow-xl transition">
              <div className="bg-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Calidad Garantizada</h3>
              <p className="text-gray-600">Agricultores verificados y productos de la más alta calidad</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center hover:shadow-xl transition">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Apoyo Local</h3>
              <p className="text-gray-600">Fomentas la economía local y apoyas a familias de agricultores</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center hover:shadow-xl transition">
              <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Entrega Rápida</h3>
              <p className="text-gray-600">Sistema de entrega eficiente para que recibas tus productos frescos</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 text-center hover:shadow-xl transition">
              <div className="bg-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparencia</h3>
              <p className="text-gray-600">Conoces exactamente de quién vienen tus productos y cómo se cultivaron</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Eres agricultor?</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Únete a AgroLink y vende tus productos directamente a clientes, sin intermediarios. Aumenta tus ganancias y llega a más personas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg inline-flex items-center justify-center">
              Registrarse Gratis
              <Award className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contact & Social Media Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-green-600 p-3 rounded-xl mr-3">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">AgroLink</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Conectando agricultores y consumidores para un futuro alimentario más justo y sostenible.
              </p>
              <div className="flex gap-4">
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
            <div>
              <h4 className="text-xl font-bold mb-6">Contáctanos</h4>
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-3 text-green-500" />
                  <span>info@agrolink.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-3 text-green-500" />
                  <span>+591 123 456 789</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MessageCircle className="h-5 w-5 mr-3 text-green-500" />
                  <span>WhatsApp disponible</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Enlaces Rápidos</h4>
              <div className="space-y-3">
                <Link to="/productos" className="block text-gray-400 hover:text-white transition">Productos</Link>
                <Link to="/register" className="block text-gray-400 hover:text-white transition">Registrarse</Link>
                <Link to="/login" className="block text-gray-400 hover:text-white transition">Iniciar Sesión</Link>
                <Link to="/perfil" className="block text-gray-400 hover:text-white transition">Mi Perfil</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgroLink. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
