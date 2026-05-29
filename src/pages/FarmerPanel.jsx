import { useState, useEffect } from 'react'
import { getProducts, getOrders, addProduct, updateProductPhoto, getFarmers, updateFarmer, deleteProduct } from '../services/firestoreService'
import { uploadProductImage, uploadProfileImage } from '../services/storageService'
import { CheckCircle, Clock, Truck, Package, Plus, MapPin, Star, Camera, Settings, LogOut, Upload, TrendingUp, DollarSign, Users, BarChart3, Edit2, Trash2, Eye, Heart, Award, Zap, Target, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function FarmerPanel() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [farmers, setFarmers] = useState([])
  const [farmerProfile, setFarmerProfile] = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditPhoto, setShowEditPhoto] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [timeRange, setTimeRange] = useState('week')
  
  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Verduras',
    price: '',
    unit: 'kg',
    description: '',
    photoUrl: '',
    minQuantity: 10
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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(productId)
        alert('Producto eliminado exitosamente')
        loadData()
      } catch (error) {
        alert('Error al eliminar producto: ' + error.message)
      }
    }
  }

  const calculateStats = () => {
    const totalSales = farmerOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    const completedOrders = farmerOrders.filter(o => o.status === 'completed').length
    const pendingOrders = farmerOrders.filter(o => o.status === 'pending').length
    const averageOrderValue = farmerOrders.length > 0 ? totalSales / farmerOrders.length : 0
    const totalProductsSold = farmerOrders.reduce((sum, order) => {
      if (order.products) {
        return sum + order.products.reduce((pSum, p) => pSum + (p.quantity || 0), 0)
      }
      return sum
    }, 0)

    return {
      totalSales,
      completedOrders,
      pendingOrders,
      averageOrderValue,
      totalProductsSold
    }
  }

  const stats = calculateStats()

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

  const handleFileUpload = async (e, productId) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const downloadURL = await uploadProductImage(file, productId)
      await updateProductPhoto(productId, downloadURL)
      alert('Foto subida exitosamente')
      loadData()
    } catch (error) {
      alert('Error al subir foto: ' + error.message)
    }
  }

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const downloadURL = await uploadProfileImage(file, user.uid)
      await updateFarmer(farmerProfile.id, { photoUrl: downloadURL })
      alert('Foto de perfil actualizada exitosamente')
      loadData()
    } catch (error) {
      alert('Error al subir foto de perfil: ' + error.message)
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 text-white py-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mr-4">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{farmerProfile?.businessName || 'Mi Negocio'}</h1>
                <p className="text-green-100 text-lg">{farmerProfile?.name}</p>
                <div className="flex items-center mt-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{farmerProfile?.zone}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold">{farmerProfile?.rating || 4.5}</span>
                    <span className="text-sm text-green-200 ml-1">({Math.floor(Math.random() * 50) + 10} reseñas)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditProfile(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-5 py-3 rounded-xl transition flex items-center font-medium"
              >
                <Settings className="h-5 w-5 mr-2" />
                Configurar Perfil
              </button>
              <button
                onClick={logout}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-5 py-3 rounded-xl transition flex items-center font-medium"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Salir
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-white/50" />
              </div>
              <p className="text-green-100 text-sm font-medium">Productos Activos</p>
              <p className="text-3xl font-bold">{farmerProducts.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-white/50" />
              </div>
              <p className="text-green-100 text-sm font-medium">Pedidos Recibidos</p>
              <p className="text-3xl font-bold">{farmerOrders.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-white/50" />
              </div>
              <p className="text-green-100 text-sm font-medium">Ventas Totales</p>
              <p className="text-3xl font-bold">Bs. {stats.totalSales.toFixed(0)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <Zap className="h-5 w-5 text-white/50" />
              </div>
              <p className="text-green-100 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <Target className="h-5 w-5 text-white/50" />
              </div>
              <p className="text-green-100 text-sm font-medium">Promedio/Pedido</p>
              <p className="text-3xl font-bold">Bs. {stats.averageOrderValue.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-lg sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 rounded-xl font-medium transition whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-4 rounded-xl font-medium transition whitespace-nowrap ${
                activeTab === 'products' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package className="h-5 w-5 inline mr-2" />
              Mis Productos
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 rounded-xl font-medium transition whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Truck className="h-5 w-5 inline mr-2" />
              Pedidos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8" />
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Total</span>
                </div>
                <p className="text-4xl font-bold mb-2">Bs. {stats.totalSales.toFixed(2)}</p>
                <p className="text-green-100">Ventas totales</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <Package className="h-8 w-8" />
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Cantidad</span>
                </div>
                <p className="text-4xl font-bold mb-2">{stats.totalProductsSold}</p>
                <p className="text-blue-100">Productos vendidos</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8" />
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Clientes</span>
                </div>
                <p className="text-4xl font-bold mb-2">{farmerOrders.length}</p>
                <p className="text-purple-100">Pedidos recibidos</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-green-600" />
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                {farmerOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-xl mr-4">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Pedido #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">{order.customerName || 'Cliente'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">Bs. {order.total?.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'completed' ? 'Completado' :
                         order.status === 'pending' ? 'Pendiente' : order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {farmerOrders.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Mis Productos</h2>
                <p className="text-gray-600">Gestiona tu catálogo de productos</p>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 flex items-center shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Producto
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {farmerProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
                  <div className="relative h-56 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center overflow-hidden">
                    {product.photoUrl ? (
                      <img src={product.photoUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    ) : (
                      <span className="text-9xl">{product.image}</span>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <label className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white transition cursor-pointer" title="Subir foto desde dispositivo">
                        <Upload className="h-5 w-5 text-green-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, product.id)}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => handleEditPhoto(product)}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white transition"
                        title="Cambiar foto por URL"
                      >
                        <Camera className="h-5 w-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-red-600 transition"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-green-600 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description || product.category}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">Bs. {product.price}</span>
                        <span className="text-sm text-gray-600">/{product.unit}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.available ? 'Disponible' : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {farmerProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl mb-4">No tienes productos aún</p>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Agregar Primer Producto
                </button>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Pedidos</h2>
              <p className="text-gray-600">Gestiona los pedidos de tus clientes</p>
            </div>
            {farmerOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center shadow-lg border border-gray-100">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl">No tienes pedidos pendientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {farmerOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">Pedido #{order.id.slice(0, 8)}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status === 'pending' ? 'Pendiente' :
                             order.status === 'confirmed' ? 'Confirmado' : 'Entregado'}
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium">{order.customerName || 'Cliente'}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.products?.length} productos • Bs. {order.total?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center">
                            <Truck className="h-4 w-4 mr-2" />
                            Marcar Entregado
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Productos:</p>
                      <div className="space-y-2">
                        {order.products?.map((product, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{product.name} x{product.quantity}</span>
                            <span className="text-gray-900 font-medium">Bs. {(product.price * product.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
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
