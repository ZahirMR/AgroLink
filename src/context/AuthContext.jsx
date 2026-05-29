import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase/config'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

const USER_SESSION_KEY = 'agrolink_user_session'

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  // Inicializar desde localStorage para sobrevivir navegaciones a /admin
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_SESSION_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
      }
    }, 3000)

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
            if (userDoc.exists()) {
              const userData = userDoc.data()
              const userType = userData.userType || 'client'
              
              // No registrar sesiones de admin en AuthContext
              if (userType === 'admin') {
                setLoading(false)
                clearTimeout(timeout)
                return
              }

              const userState = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                userType: userType,
                name: userData.name || firebaseUser.email
              }
              setUser(userState)
              localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userState))
            } else {
              const userState = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                userType: 'client'
              }
              setUser(userState)
              localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userState))
            }
          } catch (error) {
            const userState = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              userType: 'client'
            }
            setUser(userState)
            localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userState))
          }
        } else {
          // Solo limpiar si NO es porque el admin hizo signOut sin que el usuario hiciera logout
          // Verificar si tenemos sesión de usuario guardada y si el usuario NO hizo logout explícito
          const savedSession = localStorage.getItem(USER_SESSION_KEY)
          const userDidLogout = localStorage.getItem('agrolink_user_logged_out')
          
          if (!savedSession || userDidLogout === 'true') {
            // El usuario cerró sesión explícitamente o no había sesión
            setUser(null)
            localStorage.removeItem(USER_SESSION_KEY)
            localStorage.removeItem('agrolink_user_logged_out')
          }
          // Si hay savedSession y no fue logout explícito, mantener el estado actual
        }
        setLoading(false)
        clearTimeout(timeout)
      }
    )

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const login = async (email, password) => {
    // Limpiar flag de logout antes de iniciar sesión
    localStorage.removeItem('agrolink_user_logged_out')
    const result = await signInWithEmailAndPassword(auth, email, password)
    
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (userDoc.exists()) {
      const userType = userDoc.data().userType || 'client'
      localStorage.setItem('activeSessionType', userType)
    }
    
    return result
  }

  const logout = async () => {
    // Marcar que el usuario cerró sesión explícitamente
    localStorage.setItem('agrolink_user_logged_out', 'true')
    // Limpiar sesión guardada
    localStorage.removeItem(USER_SESSION_KEY)
    localStorage.removeItem('activeSessionType')
    localStorage.removeItem('isAdminSession')
    localStorage.removeItem('adminEmail')
    setUser(null)
    await signOut(auth)
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
