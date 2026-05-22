import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, getFarmers } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Filter, MapPin, Star, Truck, Banknote, QrCode, CreditCard, Package, AlertCircle, Lock } from 'lucide-react'

function Products() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState({})

  const categories = ['Todos', 'Verduras', 'Frutas', 'Cereales', 'Tubérculos']

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

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!user && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inicia sesión para ver productos</h2>
            <p className="text-gray-600 mb-6">Debes iniciar sesión para ver el catálogo de productos y realizar pedidos.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Iniciar Sesión
            </button>
          </div>
        )}

        {user && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Catálogo de Productos - Ventas por Mayor</h1>
              <p className="text-gray-600 mb-4">Compra directamente a agricultores locales para tu negocio (mercados, restaurantes, tiendas)</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <Package className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Ventas por Mayor (B2B)</p>
                  <p className="text-sm text-blue-700">Mínimos de compra por producto para asegurar costos de entrega eficientes. Ideal para negocios, mercados, restaurantes y comercios.</p>
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            )}

            {!loading && (
              <>
                {/* Filter */}
                <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <Filter className="h-5 w-5 text-green-600" />
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-lg transition ${
                            selectedCategory === category
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cart Summary */}
                {cart.length > 0 && (
                  <div className="mb-8 bg-green-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold">{cart.length} productos en el carrito</span>
                      </div>
                      <button
                        onClick={goToCheckout}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Finalizar Pedido
                      </button>
                    </div>
                    <div className="space-y-2">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex-1">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-sm text-gray-600 ml-2">x{item.quantity} {item.unit}</span>
                          </div>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <AlertCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {
                    const farmer = farmers.find(f => f.id === product.farmerId)
                    return (
                      <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                        <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                          {product.photoUrl ? (
                            <img src={product.photoUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-7xl">{product.image}</span>
                          )}
                        </div>
                        <div className="p-5">
                          {/* Farmer Info */}
                          <div className="flex items-center justify-between mb-3 pb-3 border-b">
                            <div>
                              <p className="text-xs text-green-600 font-semibold">{farmer?.businessName || farmer?.name}</p>
                              <div className="flex items-center text-gray-500 text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{farmer?.zone}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm font-semibold">{farmer?.rating || 4.5}</span>
                            </div>
                          </div>

                          {/* Product Info */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{product.description || product.category}</p>
                          
                          {/* Minimum Quantity */}
                          <div className="bg-blue-50 p-2 rounded-lg mb-3 flex items-center">
                            <Package className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-xs text-blue-900 font-semibold">
                              Mínimo: {product.minQuantity || 10} {product.unit}
                            </span>
                          </div>
                          
                          {/* Delivery & Payment Info */}
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              {farmer?.deliveryMethods?.map(method => (
                                <span key={method} className="flex items-center text-xs bg-white px-2 py-1 rounded border">
                                  {getDeliveryIcon(method)}
                                  <span className="ml-1">{method === 'delivery' ? 'Delivery' : 'Recoger'}</span>
                                </span>
                              ))}
                              {farmer?.deliveryFee > 0 && (
                                <span className="text-xs text-green-600 font-semibold">+Bs. {farmer.deliveryFee}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {farmer?.paymentMethods?.map(method => (
                                <span key={method} className="flex items-center text-xs bg-white px-2 py-1 rounded border">
                                  {getPaymentIcon(method)}
                                  <span className="ml-1">{method === 'cash' ? 'Efectivo' : method === 'qr' ? 'QR' : 'Tarjeta'}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price & Add to Cart */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-green-600">Bs. {product.price}</span>
                                <span className="text-sm text-gray-600">/{product.unit}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={product.minQuantity || 10}
                                defaultValue={product.minQuantity || 10}
                                onChange={(e) => setQuantities({ ...quantities, [product.id]: parseInt(e.target.value) })}
                                className="w-20 px-3 py-2 border rounded-lg text-center"
                                placeholder="Cant."
                              />
                              <span className="text-sm text-gray-600">{product.unit}</span>
                              <button
                                onClick={() => addToCart(product, quantities[product.id])}
                                className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                              >
                                <ShoppingCart className="h-5 w-5 mr-1" />
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
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500 text-lg">No hay productos en esta categoría</p>
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
