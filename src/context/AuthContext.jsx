import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase/config'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Firebase auth timeout - forcing render')
        setLoading(false)
      }
    }, 5000)

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Obtener datos adicionales del usuario desde Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
            if (userDoc.exists()) {
              setUser({
                ...firebaseUser,
                userType: userDoc.data().userType || 'client',
                name: userDoc.data().name || firebaseUser.email
              })
            } else {
              // Si no existe en Firestore, usar el usuario de Firebase
              setUser({
                ...firebaseUser,
                userType: 'client'
              })
            }
          } catch (error) {
            console.error('Error al obtener datos del usuario:', error)
            setUser({
              ...firebaseUser,
              userType: 'client'
            })
          }
        } else {
          setUser(null)
        }
        setLoading(false)
        clearTimeout(timeout)
      },
      (error) => {
        console.error('Firebase auth error:', error)
        setError(error)
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
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    return signOut(auth)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
