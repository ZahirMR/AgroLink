import { useState } from 'react'
import { orders } from '../data/data'
import { Clock, CheckCircle, Truck, Package } from 'lucide-react'

function Orders() {
  const [newOrder, setNewOrder] = useState({
    customer: '',
    products: [],
    hub: 'Hub Equipetrol',
    deliveryTime: '09:00'
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'delivered':
        return <Truck className="h-5 w-5 text-green-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'confirmed':
        return 'Confirmado'
      case 'delivered':
        return 'Entregado'
      default:
        return status
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Pedido creado exitosamente')
    setNewOrder({
      customer: '',
      products: [],
      hub: 'Hub Equipetrol',
      deliveryTime: '09:00'
    })
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

        {/* New Order Form */}
        <div className="bg-primary-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Pedido</h2>
          <p className="text-sm text-gray-600 mb-4">
            ⚠️ Los pedidos cierran a las 20:00h para entrega al día siguiente
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Cliente
              </label>
              <input
                type="text"
                required
                value={newOrder.customer}
                onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: Restaurante El Fogón"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hub de Entrega
                </label>
                <select
                  value={newOrder.hub}
                  onChange={(e) => setNewOrder({...newOrder, hub: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option>Hub Equipetrol</option>
                  <option>Hub Zona Sur</option>
                  <option>Hub Villa 1ro de Mayo</option>
                  <option>Hub Plan 3000</option>
                  <option>Hub Santa Bárbara</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Entrega
                </label>
                <input
                  type="time"
                  value={newOrder.deliveryTime}
                  onChange={(e) => setNewOrder({...newOrder, deliveryTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Crear Pedido
            </button>
          </form>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Pedidos Recientes</h2>
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 mr-3">{order.customer}</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Fecha:</span> {order.date}
                    </div>
                    <div>
                      <span className="font-medium">Hub:</span> {order.hub}
                    </div>
                    <div>
                      <span className="font-medium">Entrega:</span> {order.deliveryTime}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> Bs. {order.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders
