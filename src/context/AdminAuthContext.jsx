import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase/config'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AdminAuthContext = createContext()

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Obtener datos adicionales del usuario desde Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
            if (userDoc.exists()) {
              const userData = userDoc.data()
              // Solo establecer como admin si el userType es 'admin'
              if (userData.userType === 'admin') {
                setAdminUser({
                  ...firebaseUser,
                  userType: userData.userType,
                  name: userData.name || firebaseUser.email
                })
              } else {
                setAdminUser(null)
              }
            } else {
              setAdminUser(null)
            }
          } catch (error) {
            console.error('Error al obtener datos del admin:', error)
            setAdminUser(null)
          }
        } else {
          setAdminUser(null)
        }
        setLoading(false)
      },
      (error) => {
        console.error('Firebase auth error:', error)
        setError(error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const adminLogin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const adminLogout = async () => {
    return signOut(auth)
  }

  const value = {
    adminUser,
    adminLogin,
    adminLogout,
    loading,
    error
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}
