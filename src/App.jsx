import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import FarmerPanel from './pages/FarmerPanel'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas principales con Navbar */}
          <Route path="/" element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <Home />
            </div>
          } />
          <Route path="/productos" element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <Products />
            </div>
          } />
          <Route path="/checkout" element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <Checkout />
            </div>
          } />
          <Route path="/pedidos" element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <Orders />
            </div>
          } />
          <Route path="/login" element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <Login />
            </div>
          } />
          <Route path="/register" element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <Register />
            </div>
          } />
          <Route 
            path="/perfil" 
            element={
              <div className="min-h-screen bg-white">
                <Navbar />
                <ProtectedRoute requireClient={true}>
                  <Profile />
                </ProtectedRoute>
              </div>
            } 
          />
          <Route 
            path="/agricultor" 
            element={
              <div className="min-h-screen bg-white">
                <Navbar />
                <ProtectedRoute requireFarmer={true}>
                  <FarmerPanel />
                </ProtectedRoute>
              </div>
            } 
          />
          
          {/* Rutas de administrador completamente separadas SIN Navbar */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
