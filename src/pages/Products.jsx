import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, getFarmers } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Filter, MapPin, Star, Truck, Banknote, QrCode, CreditCard, Package, AlertCircle, Lock, Search, Heart, SlidersHorizontal, X, ChevronDown, TrendingUp, Leaf, Award } from 'lucide-react'

function Products() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedZone, setSelectedZone] = useState('Todas')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [favorites, setFavorites] = useState([])

  const categories = ['Todos', 'Verduras', 'Frutas', 'Cereales', 'Tubérculos', 'Lácteos', 'Carnes', 'Hortalizas']

  useEffect(() => {
    if (!user) {
      return
    }
    loadData()
    // Cargar carrito del localStorage
    const savedCart = localStorage.getItem('agrolink_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    // Cargar favoritos
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, farmersData] = await Promise.all([
        getProducts(),
        getFarmers()
      ])
      setProducts(productsData)
      setFarmers(farmersData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (productId) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const zones = ['Todas', ...new Set(farmers.map(f => f.zone).filter(Boolean))]

  const filteredProducts = products.filter(product => {
    const farmer = farmers.find(f => f.id === product.farmerId)
    
    // Filtro por categoría
    if (selectedCategory !== 'Todos' && product.category !== selectedCategory) return false
    
    // Filtro por búsqueda
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !product.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    
    // Filtro por precio
    if (product.price < priceRange.min || product.price > priceRange.max) return false
    
    // Filtro por zona
    if (selectedZone !== 'Todas' && farmer?.zone !== selectedZone) return false
    
    return true
  }).sort((a, b) => {
    switch(sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'name-asc': return a.name.localeCompare(b.name)
      case 'name-desc': return b.name.localeCompare(a.name)
      default: return 0
    }
  })

  const addToCart = (product, quantity) => {
    const minQuantity = product.minQuantity || 10
    const finalQuantity = quantity || minQuantity
    
    if (finalQuantity < minQuantity) {
      alert(`La cantidad mínima para ${product.name} es ${minQuantity} ${product.unit}`)
      return
    }
    
    // Verificar si el producto ya está en el carrito
    const existingIndex = cart.findIndex(item => item.id === product.id)
    
    let newCart
    if (existingIndex >= 0) {
      // Actualizar cantidad si ya existe
      newCart = [...cart]
      newCart[existingIndex].quantity = finalQuantity
    } else {
      // Agregar nuevo producto
      newCart = [...cart, { ...product, quantity: finalQuantity }]
    }
    
    setCart(newCart)
    localStorage.setItem('agrolink_cart', JSON.stringify(newCart))
    alert(`${product.name} agregado al carrito (${finalQuantity} ${product.unit})`)
  }

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem('agrolink_cart', JSON.stringify(newCart))
  }

  const goToCheckout = () => {
    navigate('/checkout')
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user && (
          <div className="bg-white rounded-2xl p-16 text-center shadow-xl border border-gray-100">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Inicia sesión para ver productos</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-xl mx-auto">Debes iniciar sesión para ver el catálogo de productos y realizar pedidos.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 shadow-lg"
            >
              Iniciar Sesión
            </button>
          </div>
        )}

        {user && (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 rounded-3xl p-10 text-white mb-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 left-10 w-48 h-48 bg-green-300 rounded-full blur-3xl"></div>
                </div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                      <Leaf className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">Catálogo de Productos</h1>
                      <p className="text-green-100 text-lg">Compra directamente a agricultores locales para tu negocio</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3">
                      <Package className="h-5 w-5 mr-2" />
                      <span className="font-medium">Ventas por Mayor</span>
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3">
                      <Truck className="h-5 w-5 mr-2" />
                      <span className="font-medium">Entrega Directa</span>
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3">
                      <Star className="h-5 w-5 mr-2" />
                      <span className="font-medium">Calidad Garantizada</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start">
                  <div className="bg-blue-600 p-3 rounded-xl mr-4 flex-shrink-0">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 mb-2">💡 Ventas por Mayor (B2B)</p>
                    <p className="text-gray-600">Mínimos de compra por producto para asegurar costos de entrega eficientes. Ideal para negocios, mercados, restaurantes y comercios.</p>
                  </div>
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Cargando productos...</p>
              </div>
            )}

            {!loading && (
              <>
                {/* Search and Filters */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    {/* Search */}
                    <div className="flex-1 relative">
                      <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                      />
                    </div>
                    
                    {/* Filter Toggle */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
                    >
                      <SlidersHorizontal className="h-5 w-5" />
                      Filtros
                      {showFilters && <X className="h-5 w-5" />}
                    </button>

                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:border-green-500 focus:outline-none transition cursor-pointer"
                      >
                        <option value="default">Ordenar por</option>
                        <option value="price-asc">Precio: Menor a Mayor</option>
                        <option value="price-desc">Precio: Mayor a Menor</option>
                        <option value="name-asc">Nombre: A-Z</option>
                        <option value="name-desc">Nombre: Z-A</option>
                      </select>
                      <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Price Range */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Rango de Precio</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              placeholder="Mín"
                              value={priceRange.min}
                              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                              type="number"
                              placeholder="Máx"
                              value={priceRange.max}
                              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                            />
                          </div>
                        </div>

                        {/* Zone Filter */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Zona</label>
                          <select
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition cursor-pointer"
                          >
                            {zones.map(zone => (
                              <option key={zone} value={zone}>{zone}</option>
                            ))}
                          </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              setSearchTerm('')
                              setPriceRange({ min: 0, max: 1000 })
                              setSelectedZone('Todas')
                              setSelectedCategory('Todos')
                              setSortBy('default')
                            }}
                            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Limpiar Filtros
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <Filter className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Categorías</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2.5 rounded-xl transition transform hover:scale-105 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cart Summary */}
                {cart.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg mb-8 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-green-600 p-3 rounded-xl mr-3">
                          <ShoppingCart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-lg">{cart.length} productos en el carrito</span>
                          <p className="text-sm text-gray-600">Total: Bs. {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={goToCheckout}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 shadow-lg flex items-center"
                      >
                        Finalizar Pedido
                        <TrendingUp className="h-5 w-5 ml-2" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900">{item.name}</span>
                            <span className="text-gray-600 ml-2">x{item.quantity} {item.unit}</span>
                            <span className="text-green-600 font-bold ml-2">Bs. {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                          >
                            <AlertCircle className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    Mostrando <span className="font-bold text-gray-900">{filteredProducts.length}</span> productos
                  </p>
                  {favorites.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory('Todos')
                        setSearchTerm('')
                        setPriceRange({ min: 0, max: 1000 })
                        setSelectedZone('Todas')
                      }}
                      className="text-green-600 hover:text-green-700 font-medium flex items-center"
                    >
                      <Heart className="h-5 w-5 mr-1 fill-current" />
                      {favorites.length} favoritos
                    </button>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => {
                    const farmer = farmers.find(f => f.id === product.farmerId)
                    const isFavorite = favorites.includes(product.id)
                    return (
                      <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
                        <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center overflow-hidden">
                          {product.photoUrl ? (
                            <img src={product.photoUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          ) : (
                            <span className="text-9xl">{product.image}</span>
                          )}
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition shadow-lg"
                          >
                            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </button>
                          <div className="absolute top-4 left-4 bg-green-600 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg">
                            {product.category}
                          </div>
                          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                              <span className="text-sm font-bold text-gray-900">{farmer?.rating || 4.5}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          {/* Farmer Info */}
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-3">
                              <MapPin className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{farmer?.businessName || farmer?.name}</p>
                              <p className="text-xs text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {farmer?.zone}
                              </p>
                            </div>
                          </div>

                          {/* Product Info */}
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description || product.category}</p>
                          
                          {/* Minimum Quantity Badge */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-4 flex items-center border border-blue-200">
                            <div className="bg-blue-600 p-2 rounded-lg mr-3">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-blue-900 font-bold">Venta por Mayor</p>
                              <p className="text-xs text-blue-700">Mínimo: {product.minQuantity || 10} {product.unit}</p>
                            </div>
                          </div>
                          
                          {/* Delivery & Payment Info */}
                          <div className="bg-gray-50 p-4 rounded-xl mb-4">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {farmer?.deliveryMethods?.map(method => (
                                <span key={method} className="flex items-center text-xs bg-white px-3 py-2 rounded-full border shadow-sm font-medium">
                                  {getDeliveryIcon(method)}
                                  <span className="ml-1">{method === 'delivery' ? 'Delivery' : 'Recoger'}</span>
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {farmer?.paymentMethods?.map(method => (
                                <span key={method} className="flex items-center text-xs bg-white px-3 py-2 rounded-full border shadow-sm font-medium">
                                  {getPaymentIcon(method)}
                                  <span className="ml-1">{method === 'cash' ? 'Efectivo' : method === 'qr' ? 'QR' : 'Tarjeta'}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price & Add to Cart */}
                          <div className="space-y-4">
                            <div className="flex items-end justify-between">
                              <div>
                                <span className="text-3xl font-bold text-green-600">Bs. {product.price}</span>
                                <span className="text-sm text-gray-600">/{product.unit}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <label className="text-xs text-gray-600 mb-1 block font-medium">Cantidad</label>
                                <input
                                  type="number"
                                  min={product.minQuantity || 10}
                                  defaultValue={product.minQuantity || 10}
                                  onChange={(e) => setQuantities({ ...quantities, [product.id]: parseInt(e.target.value) })}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-bold focus:border-green-500 focus:outline-none transition"
                                  placeholder="Cant."
                                />
                              </div>
                              <button
                                onClick={() => addToCart(product, quantities[product.id])}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Agregar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-xl mb-4">No se encontraron productos</p>
                    <p className="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Products
