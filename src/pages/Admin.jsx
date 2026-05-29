import { useState, useEffect } from 'react'
import { getUsers, getFarmers, getProducts, getOrders, updateUser, updateFarmer, addProduct, deleteProduct, createTestFarmer } from '../services/firestoreService'
import { Users, BarChart3, LogOut, Shield, Package, ShoppingCart, DollarSign, Activity, TrendingUp, Edit, Trash2, Plus, Search, Image as ImageIcon, User, MapPin, Star, Phone, Mail, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'


function Admin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedClientOrders, setSelectedClientOrders] = useState(null)
  
  const [users, setUsers] = useState([])
  const [farmers, setFarmers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  
  // Estados para modales
  const [editingUser, setEditingUser] = useState(null)
  const [editingFarmer, setEditingFarmer] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedFarmerProducts, setSelectedFarmerProducts] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showFarmerModal, setShowFarmerModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showFarmerProductsModal, setShowFarmerProductsModal] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const isAdminSession = localStorage.getItem('isAdminSession')
    if (!isAdminSession) {
      navigate('/admin-login')
      return
    }
    
    loadData()
  }, [])

  const handleLogout = () => {
    // Solo limpiar sesión de admin de localStorage
    // NO hacer signOut de Firebase Auth para no afectar la sesión del agricultor/cliente
    localStorage.removeItem('isAdminSession')
    localStorage.removeItem('adminEmail')
    // Redirigir al login de admin
    navigate('/admin-login')
  }

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Cargando datos...')
      const [usersData, farmersData, productsData, ordersData] = await Promise.all([
        getUsers(),
        getFarmers(),
        getProducts(),
        getOrders()
      ])
      console.log('Datos cargados:', { usersData, farmersData, productsData, ordersData })
      setUsers(usersData)
      setFarmers(farmersData)
      setProducts(productsData)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      alert('Error al cargar datos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file, userId, userType) => {
    try {
      setUploadingImage(true)
      console.log('Iniciando subida de imagen:', { fileName: file.name, userId, userType })
      const storageRef = ref(storage, `${userType}/${userId}/${file.name}`)
      console.log('Storage ref creado:', storageRef)
      await uploadBytes(storageRef, file)
      console.log('Imagen subida exitosamente')
      const downloadURL = await getDownloadURL(storageRef)
      console.log('URL de descarga obtenida:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('Error al subir imagen:', error)
      alert('Error al subir imagen: ' + error.message)
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowUserModal(true)
  }

  const handleEditFarmer = (farmer) => {
    setEditingFarmer(farmer)
    setShowFarmerModal(true)
  }

  const handleSaveUser = async (userData) => {
    try {
      if (userData.imageFile) {
        const imageUrl = await handleImageUpload(userData.imageFile, userData.id, 'users')
        userData.photoURL = imageUrl
        delete userData.imageFile
      }
      
      await updateUser(userData.id, userData)
      setShowUserModal(false)
      setEditingUser(null)
      loadData()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      alert('Error al guardar usuario: ' + error.message)
    }
  }

  const handleSaveFarmer = async (farmerData) => {
    try {
      if (farmerData.imageFile) {
        const imageUrl = await handleImageUpload(farmerData.imageFile, farmerData.id, 'farmers')
        farmerData.photoURL = imageUrl
        delete farmerData.imageFile
      }
      
      await updateFarmer(farmerData.id, farmerData)
      setShowFarmerModal(false)
      setEditingFarmer(null)
      loadData()
    } catch (error) {
      console.error('Error al guardar agricultor:', error)
      alert('Error al guardar agricultor: ' + error.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await updateUser(userId, { deleted: true })
        loadData()
      } catch (error) {
        console.error('Error al eliminar usuario:', error)
        alert('Error al eliminar usuario')
      }
    }
  }

  const handleDeleteFarmer = async (farmerId) => {
    if (window.confirm('¿Estás seguro de eliminar este agricultor?')) {
      try {
        await updateFarmer(farmerId, { deleted: true })
        loadData()
      } catch (error) {
        console.error('Error al eliminar agricultor:', error)
        alert('Error al eliminar agricultor')
      }
    }
  }

  const handleViewFarmerProducts = (farmer) => {
    const farmerProducts = products.filter(p => p.farmerId === farmer.id)
    setSelectedFarmerProducts({ farmer, products: farmerProducts })
    setShowFarmerProductsModal(true)
  }

  const handleAddProduct = (farmer) => {
    setEditingProduct({ farmerId: farmer.id, farmerName: farmer.name })
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowProductModal(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(productId)
        loadData()
        if (selectedFarmerProducts) {
          const updatedProducts = selectedFarmerProducts.products.filter(p => p.id !== productId)
          setSelectedFarmerProducts({ ...selectedFarmerProducts, products: updatedProducts })
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error)
        alert('Error al eliminar producto')
      }
    }
  }

  const handleSaveProduct = async (productData) => {
    try {
      if (productData.imageFile) {
        const imageUrl = await handleImageUpload(productData.imageFile, productData.farmerId || productData.id, 'products')
        productData.image = imageUrl
        delete productData.imageFile
      }
      
      if (productData.id) {
        // Editar producto existente
        await updateFarmer(productData.id, productData)
      } else {
        // Agregar nuevo producto
        await addProduct(productData)
      }
      
      setShowProductModal(false)
      setEditingProduct(null)
      loadData()
      
      if (selectedFarmerProducts) {
        const farmerProducts = products.filter(p => p.farmerId === selectedFarmerProducts.farmer.id)
        setSelectedFarmerProducts({ ...selectedFarmerProducts, products: farmerProducts })
      }
    } catch (error) {
      console.error('Error al guardar producto:', error)
      alert('Error al guardar producto: ' + error.message)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const clientCount = users.filter(u => u.userType === 'client').length
  const farmerUserCount = users.filter(u => u.userType === 'farmer').length
  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  const formatDate = (date) => {
    if (!date) return '-'
    try {
      const d = new Date(date)
      if (isNaN(d.getTime())) return '-'
      return d.toLocaleDateString()
    } catch {
      return '-'
    }
  }

  const getClientName = (order) => {
    if (order.customerName) return order.customerName
    if (order.customerId) {
      const client = users.find(u => u.id === order.customerId)
      return client?.name || '-'
    }
    return '-'
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
                <p className="text-slate-400 text-sm">Gestión profesional de la plataforma</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition flex items-center border border-slate-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-slate-700">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-3 font-medium transition ${
                  activeTab === 'dashboard'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('farmers')}
                className={`px-4 py-3 font-medium transition ${
                  activeTab === 'farmers'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Agricultores
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-4 py-3 font-medium transition ${
                  activeTab === 'clients'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Clientes
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-3 font-medium transition ${
                  activeTab === 'orders'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pedidos
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-3 font-medium transition ${
                  activeTab === 'reports'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Reportes
              </button>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Total Usuarios</p>
                        <p className="text-3xl font-bold text-white">{users.length}</p>
                        <p className="text-emerald-400 text-xs mt-1">Registrados</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Ventas Totales</p>
                        <p className="text-3xl font-bold text-white">Bs. {totalSales.toFixed(0)}</p>
                        <p className="text-emerald-400 text-xs mt-1">Acumulado</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Pedidos Totales</p>
                        <p className="text-3xl font-bold text-white">{orders.length}</p>
                        <p className="text-emerald-400 text-xs mt-1">{pendingOrders} pendientes</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Total Productos</p>
                        <p className="text-3xl font-bold text-white">{products.length}</p>
                        <p className="text-emerald-400 text-xs mt-1">Activos</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Clientes</p>
                        <p className="text-2xl font-bold text-white">{clientCount}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-emerald-400" />
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Agricultores</p>
                        <p className="text-2xl font-bold text-white">{farmerUserCount}</p>
                      </div>
                      <Activity className="h-8 w-8 text-emerald-400" />
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Tasa de Conversión</p>
                        <p className="text-2xl font-bold text-white">{orders.length > 0 ? ((orders.filter(o => o.status === 'completed').length / orders.length) * 100).toFixed(1) : 0}%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Farmers Tab */}
            {activeTab === 'farmers' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Agricultores</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={async () => {
                        try {
                          await createTestFarmer()
                          alert('Agricultor de prueba creado exitosamente\nEmail: agricultor@agrolink.test\nPassword: agricultor123')
                          loadData()
                        } catch (error) {
                          alert('Error al crear agricultor de prueba: ' + error.message)
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Agricultor de Prueba
                    </button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Buscar agricultor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFarmers.map(farmer => (
                      <div key={farmer.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-emerald-500 transition">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            {farmer.photoURL ? (
                              <img src={farmer.photoURL} alt={farmer.name} className="w-16 h-16 rounded-full object-cover" />
                            ) : (
                              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{farmer.name}</h3>
                              <p className="text-slate-400 text-sm">{farmer.businessName || '-'}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditFarmer(farmer)}
                              className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition"
                            >
                              <Edit className="h-4 w-4 text-white" />
                            </button>
                            <button
                              onClick={() => handleDeleteFarmer(farmer.id)}
                              className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-slate-300">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{farmer.zone || '-'}</span>
                          </div>
                          <div className="flex items-center text-slate-300">
                            <Star className="h-4 w-4 mr-2 text-yellow-400" />
                            <span className="text-sm">{farmer.rating || 4.5}</span>
                          </div>
                          <div className="flex items-center text-slate-300">
                            <Phone className="h-4 w-4 mr-2" />
                            <span className="text-sm">{farmer.phone || '-'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewFarmerProducts(farmer)}
                            className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-500 transition flex items-center justify-center"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Ver Productos
                          </button>
                          <button
                            onClick={() => handleAddProduct(farmer)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-500 transition flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Clientes</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Buscar cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.filter(u => u.userType === 'client').map(user => (
                      <div key={user.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-emerald-500 transition">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                            ) : (
                              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{user.name || '-'}</h3>
                              <p className="text-slate-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition"
                            >
                              <Edit className="h-4 w-4 text-white" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-slate-300">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          <div className="flex items-center text-slate-300">
                            <Phone className="h-4 w-4 mr-2" />
                            <span className="text-sm">{user.phone || '-'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white">Pedidos</h2>
                </div>
                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      No hay pedidos registrados
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase">ID</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase">Cliente</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase">Total</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase">Estado</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase">Fecha</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                              <td className="py-3 px-4 text-white">{typeof order.id === 'string' ? order.id.slice(0, 8) : order.id}</td>
                              <td className="py-3 px-4 text-slate-300">{getClientName(order)}</td>
                              <td className="py-3 px-4 text-white">Bs. {order.total?.toFixed(2) || 0}</td>
                              <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {order.status === 'completed' ? 'Completado' :
                                   order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-400">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => setSelectedClientOrders(order)}
                                  className="text-emerald-400 hover:text-emerald-300 text-sm"
                                >
                                  Ver Detalles
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white">Reportes</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Ventas por Mes</h3>
                      <div className="space-y-3">
                        {orders.length > 0 ? (
                          orders.map(order => (
                            <div key={order.id} className="flex justify-between items-center">
                              <span className="text-slate-300">{formatDate(order.createdAt)}</span>
                              <span className="text-emerald-400 font-bold">Bs. {order.total?.toFixed(2) || 0}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400">No hay datos de ventas</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Productos Más Vendidos</h3>
                      <div className="space-y-3">
                        {products.length > 0 ? (
                          products.slice(0, 5).map(product => (
                            <div key={product.id} className="flex justify-between items-center">
                              <span className="text-slate-300">{product.name}</span>
                              <span className="text-emerald-400 font-bold">Bs. {product.price?.toFixed(2) || 0}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400">No hay productos registrados</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Top Agricultores</h3>
                      <div className="space-y-3">
                        {farmers.length > 0 ? (
                          farmers.slice(0, 5).map(farmer => {
                            const farmerProducts = products.filter(p => p.farmerId === farmer.id)
                            return (
                              <div key={farmer.id} className="flex justify-between items-center">
                                <span className="text-slate-300">{farmer.name}</span>
                                <span className="text-emerald-400 font-bold">{farmerProducts.length} productos</span>
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-slate-400">No hay agricultores registrados</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Resumen General</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Total Ventas</span>
                          <span className="text-emerald-400 font-bold">Bs. {totalSales.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Total Pedidos</span>
                          <span className="text-emerald-400 font-bold">{orders.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Pedidos Pendientes</span>
                          <span className="text-yellow-400 font-bold">{pendingOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Pedidos Completados</span>
                          <span className="text-emerald-400 font-bold">{orders.filter(o => o.status === 'completed').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingUser ? 'Editar Cliente' : 'Agregar Cliente'}
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(editingUser); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Nombre</label>
                  <input
                    type="text"
                    value={editingUser?.name || ''}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser?.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={editingUser?.phone || ''}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingUser({...editingUser, imageFile: e.target.files[0]})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Farmer Modal */}
      {showFarmerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingFarmer ? 'Editar Agricultor' : 'Agregar Agricultor'}
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveFarmer(editingFarmer); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Nombre</label>
                  <input
                    type="text"
                    value={editingFarmer?.name || ''}
                    onChange={(e) => setEditingFarmer({...editingFarmer, name: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Nombre del Negocio</label>
                  <input
                    type="text"
                    value={editingFarmer?.businessName || ''}
                    onChange={(e) => setEditingFarmer({...editingFarmer, businessName: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Zona</label>
                  <input
                    type="text"
                    value={editingFarmer?.zone || ''}
                    onChange={(e) => setEditingFarmer({...editingFarmer, zone: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={editingFarmer?.phone || ''}
                    onChange={(e) => setEditingFarmer({...editingFarmer, phone: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingFarmer({...editingFarmer, imageFile: e.target.files[0]})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowFarmerModal(false)}
                  className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Farmer Products Modal */}
      {showFarmerProductsModal && selectedFarmerProducts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl border border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Productos de {selectedFarmerProducts.farmer.name}
              </h3>
              <button
                onClick={() => setShowFarmerProductsModal(false)}
                className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFarmerProducts.products.map(product => (
                <div key={product.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                  )}
                  <h4 className="font-semibold text-white mb-2">{product.name}</h4>
                  <p className="text-emerald-400 font-bold mb-2">Bs. {product.price?.toFixed(2) || 0}</p>
                  <p className="text-slate-400 text-sm mb-3">{product.description || '-'}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-slate-600 text-white px-3 py-2 rounded-lg hover:bg-slate-500 transition flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-500 transition flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {selectedFarmerProducts.products.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-400">
                  No hay productos registrados
                </div>
              )}
            </div>
            <button
              onClick={() => handleAddProduct(selectedFarmerProducts.farmer)}
              className="w-full mt-4 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-500 transition flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Producto
            </button>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingProduct?.id ? 'Editar Producto' : 'Agregar Producto'}
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(editingProduct); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Descripción</label>
                  <textarea
                    value={editingProduct?.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Cantidad</label>
                  <input
                    type="number"
                    value={editingProduct?.quantity || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value)})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Foto del Producto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingProduct({...editingProduct, imageFile: e.target.files[0]})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
