import { useState, useEffect } from 'react'
import { getProducts, getOrders, addProduct, updateProductPhoto, getFarmers, updateFarmer } from '../services/firestoreService'
import { CheckCircle, Clock, Truck, Package, Plus, MapPin, Star, Camera, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function FarmerPanel() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [farmers, setFarmers] = useState([])
  const [farmerProfile, setFarmerProfile] = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditPhoto, setShowEditPhoto] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  
  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Verduras',
    price: '',
    unit: 'kg',
    description: '',
    photoUrl: ''
  })

  // Profile form
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    zone: '',
    phone: '',
    description: '',
    deliveryMethods: [],
    paymentMethods: [],
    deliveryFee: ''
  })

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [productsData, ordersData, farmersData] = await Promise.all([
        getProducts(),
        getOrders(),
        getFarmers()
      ])
      setProducts(productsData)
      setOrders(ordersData)
      setFarmers(farmersData)
      
      // Find farmer profile (in real app, this would be based on user ID)
      const farmer = farmersData[0] // Using first farmer for demo
      setFarmerProfile(farmer)
      setProfileForm({
        businessName: farmer.businessName || '',
        zone: farmer.zone || '',
        phone: farmer.phone || '',
        description: farmer.description || '',
        deliveryMethods: farmer.deliveryMethods || [],
        paymentMethods: farmer.paymentMethods || [],
        deliveryFee: farmer.deliveryFee || ''
      })
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  const farmerProducts = products.filter(p => p.farmerId === farmerProfile?.id)
  const farmerOrders = orders.filter(order =>
    order.products && order.products.some(p => {
      const product = products.find(prod => prod.id === p.productId)
      return product && product.farmerId === farmerProfile?.id
    })
  )

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      await addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        farmerId: farmerProfile.id,
        image: '🌱',
        available: true
      })
      alert('Producto agregado exitosamente')
      setShowAddProduct(false)
      setNewProduct({
        name: '',
        category: 'Verduras',
        price: '',
        unit: 'kg',
        description: '',
        photoUrl: ''
      })
      loadData()
    } catch (error) {
      alert('Error al agregar producto: ' + error.message)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      await updateFarmer(farmerProfile.id, {
        ...profileForm,
        deliveryFee: parseFloat(profileForm.deliveryFee)
      })
      alert('Perfil actualizado exitosamente')
      setShowEditProfile(false)
      loadData()
    } catch (error) {
      alert('Error al actualizar perfil: ' + error.message)
    }
  }

  const handleEditPhoto = (product) => {
    setSelectedProduct(product)
    setNewPhotoUrl(product.photoUrl || '')
    setShowEditPhoto(true)
  }

  const handleSavePhoto = async () => {
    try {
      await updateProductPhoto(selectedProduct.id, newPhotoUrl)
      alert('Foto actualizada exitosamente')
      setShowEditPhoto(false)
      setSelectedProduct(null)
      setNewPhotoUrl('')
      loadData()
    } catch (error) {
      alert('Error al actualizar foto: ' + error.message)
    }
  }

  const toggleDeliveryMethod = (method) => {
    setProfileForm(prev => ({
      ...prev,
      deliveryMethods: prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter(m => m !== method)
        : [...prev.deliveryMethods, method]
    }))
  }

  const togglePaymentMethod = (method) => {
    setProfileForm(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">{farmerProfile?.businessName || 'Mi Negocio'}</h1>
              <p className="text-green-100">{farmerProfile?.name}</p>
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{farmerProfile?.zone}</span>
                <Star className="h-4 w-4 ml-3 mr-1 text-yellow-400 fill-current" />
                <span className="text-sm">{farmerProfile?.rating || 4.5}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditProfile(true)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center"
              >
                <Settings className="h-5 w-5 mr-2" />
                Configurar Perfil
              </button>
              <button
                onClick={logout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Salir
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Productos Activos</p>
                  <p className="text-2xl font-bold">{farmerProducts.length}</p>
                </div>
                <Package className="h-8 w-8 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Pedidos Recibidos</p>
                  <p className="text-2xl font-bold">{farmerOrders.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Ventas Totales</p>
                  <p className="text-2xl font-bold">
                    Bs. {farmerOrders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(0)}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Pedidos Pendientes</p>
                  <p className="text-2xl font-bold">{farmerOrders.filter(o => o.status === 'pending').length}</p>
                </div>
                <Clock className="h-8 w-8 text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 transition ${
                activeTab === 'products' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'
              }`}
            >
              Mis Productos
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 transition ${
                activeTab === 'orders' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600'
              }`}
            >
              Pedidos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mis Productos ({farmerProducts.length})</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Producto
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmerProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative">
                    {product.photoUrl ? (
                      <img src={product.photoUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-7xl">{product.image}</span>
                    )}
                    <button
                      onClick={() => handleEditPhoto(product)}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                      title="Cambiar foto"
                    >
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description || product.category}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-green-600">Bs. {product.price}</span>
                        <span className="text-sm text-gray-600">/{product.unit}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.available ? 'Disponible' : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pedidos ({farmerOrders.length})</h2>
            {farmerOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No tienes pedidos pendientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {farmerOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.id}</h3>
                        <p className="text-gray-600">{order.customer}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'pending' ? 'Pendiente' :
                         order.status === 'confirmed' ? 'Confirmado' : 'Entregado'}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      {order.status === 'pending' && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                          Confirmar
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                          Marcar Entregado
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Producto</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option>Verduras</option>
                  <option>Frutas</option>
                  <option>Cereales</option>
                  <option>Tubérculos</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Bs.)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option>kg</option>
                    <option>unidad</option>
                    <option>docena</option>
                    <option>litro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Foto (opcional)</label>
                <input
                  type="text"
                  value={newProduct.photoUrl}
                  onChange={(e) => setNewProduct({...newProduct, photoUrl: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Photo Modal */}
      {showEditPhoto && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Cambiar Foto - {selectedProduct.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Foto</label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>
              {newPhotoUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                  <img
                    src={newPhotoUrl}
                    alt="Vista previa"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={() => alert('La URL de la imagen no es válida')}
                  />
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={handleSavePhoto}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowEditPhoto(false)
                    setSelectedProduct(null)
                    setNewPhotoUrl('')
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg my-8">
            <h3 className="text-xl font-semibold mb-4">Configurar Perfil</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
                <input
                  type="text"
                  required
                  value={profileForm.businessName}
                  onChange={(e) => setProfileForm({...profileForm, businessName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                <input
                  type="text"
                  required
                  value={profileForm.zone}
                  onChange={(e) => setProfileForm({...profileForm, zone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Métodos de Entrega</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleDeliveryMethod('delivery')}
                    className={`px-4 py-2 rounded-lg border ${
                      profileForm.deliveryMethods.includes('delivery')
                        ? 'bg-green-100 border-green-600 text-green-700'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    🚚 Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleDeliveryMethod('pickup')}
                    className={`px-4 py-2 rounded-lg border ${
                      profileForm.deliveryMethods.includes('pickup')
                        ? 'bg-green-100 border-green-600 text-green-700'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    📍 Recoger
                  </button>
                </div>
              </div>
              {profileForm.deliveryMethods.includes('delivery') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo de Delivery (Bs.)</label>
                  <input
                    type="number"
                    value={profileForm.deliveryFee}
                    onChange={(e) => setProfileForm({...profileForm, deliveryFee: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Métodos de Pago</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePaymentMethod('cash')}
                    className={`px-4 py-2 rounded-lg border ${
                      profileForm.paymentMethods.includes('cash')
                        ? 'bg-green-100 border-green-600 text-green-700'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    💵 Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePaymentMethod('qr')}
                    className={`px-4 py-2 rounded-lg border ${
                      profileForm.paymentMethods.includes('qr')
                        ? 'bg-green-100 border-green-600 text-green-700'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    📱 QR
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePaymentMethod('card')}
                    className={`px-4 py-2 rounded-lg border ${
                      profileForm.paymentMethods.includes('card')
                        ? 'bg-green-100 border-green-600 text-green-700'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    💳 Tarjeta
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FarmerPanel
