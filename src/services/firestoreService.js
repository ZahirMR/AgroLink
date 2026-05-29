import { db } from '../firebase/config'
import { auth } from '../firebase/config'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  getDocs as getCollectionDocs,
  setDoc
} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'

// PRODUCTOS
export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), product)
    return { id: docRef.id, ...product }
  } catch (error) {
    console.error('Error al agregar producto:', error)
    throw error
  }
}

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener productos:', error)
    throw error
  }
}

export const updateProduct = async (id, product) => {
  try {
    const productRef = doc(db, 'products', id)
    await updateDoc(productRef, product)
    return { id, ...product }
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    throw error
  }
}

export const updateProductPhoto = async (id, photoUrl) => {
  try {
    const productRef = doc(db, 'products', id)
    await updateDoc(productRef, { photoUrl })
    return { id, photoUrl }
  } catch (error) {
    console.error('Error al actualizar foto de producto:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id))
    return { id }
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    throw error
  }
}

// AGRICULTORES
export const addFarmer = async (farmer) => {
  try {
    const docRef = await addDoc(collection(db, 'farmers'), farmer)
    return { id: docRef.id, ...farmer }
  } catch (error) {
    console.error('Error al agregar agricultor:', error)
    throw error
  }
}

export const getFarmers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'farmers'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener agricultores:', error)
    throw error
  }
}

export const updateFarmer = async (id, farmer) => {
  try {
    const farmerRef = doc(db, 'farmers', id)
    await updateDoc(farmerRef, farmer)
    return { id, ...farmer }
  } catch (error) {
    console.error('Error al actualizar agricultor:', error)
    throw error
  }
}

export const getFarmerByUid = async (uid) => {
  try {
    const q = query(collection(db, 'farmers'), where('uid', '==', uid))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0]
      return { id: docSnap.id, ...docSnap.data() }
    }
    // Fallback: buscar por campo userId
    const q2 = query(collection(db, 'farmers'), where('userId', '==', uid))
    const qs2 = await getDocs(q2)
    if (!qs2.empty) {
      const d = qs2.docs[0]
      return { id: d.id, ...d.data() }
    }
    return null
  } catch (error) {
    console.error('Error al obtener agricultor por UID:', error)
    return null
  }
}


// USUARIOS
export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error
  }
}

export const updateUser = async (id, user) => {
  try {
    const userRef = doc(db, 'users', id)
    await updateDoc(userRef, user)
    return { id, ...user }
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    throw error
  }
}

// PEDIDOS
export const getOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    throw error
  }
}

export const addOrder = async (order) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), order)
    return { id: docRef.id, ...order }
  } catch (error) {
    console.error('Error al agregar pedido:', error)
    throw error
  }
}

export const updateOrder = async (id, order) => {
  try {
    const orderRef = doc(db, 'orders', id)
    await updateDoc(orderRef, order)
    return { id, ...order }
  } catch (error) {
    console.error('Error al actualizar pedido:', error)
    throw error
  }
}

export const updateOrderStatus = async (id, status) => {
  try {
    const orderRef = doc(db, 'orders', id)
    await updateDoc(orderRef, { status, updatedAt: new Date().toISOString() })
    return { id, status }
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error)
    throw error
  }
}

// CREAR USUARIO CON AUTENTICACIÓN
export const createFarmerUser = async (email, password, farmerData) => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid
    
    // Crear documento en colección users
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      userType: 'farmer',
      ...farmerData
    })
    
    // Crear documento en colección farmers
    const farmerRef = await addDoc(collection(db, 'farmers'), {
      uid,
      email,
      ...farmerData
    })
    
    return { uid, farmerId: farmerRef.id, ...farmerData }
  } catch (error) {
    console.error('Error al crear usuario agricultor:', error)
    throw error
  }
}

export const deleteFarmer = async (id) => {
  try {
    await deleteDoc(doc(db, 'farmers', id))
    return id
  } catch (error) {
    console.error('Error al eliminar agricultor:', error)
    throw error
  }
}

// HUBS
export const addHub = async (hub) => {
  try {
    const docRef = await addDoc(collection(db, 'hubs'), hub)
    return { id: docRef.id, ...hub }
  } catch (error) {
    console.error('Error al agregar hub:', error)
    throw error
  }
}

export const getHubs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'hubs'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener hubs:', error)
    throw error
  }
}

export const updateHub = async (id, hub) => {
  try {
    const hubRef = doc(db, 'hubs', id)
    await updateDoc(hubRef, hub)
    return { id, ...hub }
  } catch (error) {
    console.error('Error al actualizar hub:', error)
    throw error
  }
}

export const deleteHub = async (id) => {
  try {
    await deleteDoc(doc(db, 'hubs', id))
    return id
  } catch (error) {
    console.error('Error al eliminar hub:', error)
    throw error
  }
}

export const deleteOrder = async (id) => {
  try {
    await deleteDoc(doc(db, 'orders', id))
    return id
  } catch (error) {
    console.error('Error al eliminar pedido:', error)
    throw error
  }
}

// INICIALIZAR DATOS DE EJEMPLO
export const initializeData = async () => {
  try {
    const { farmers, products, hubs, orders } = await import('../data/data')
    
    // Verificar si ya hay datos
    const productsSnapshot = await getDocs(collection(db, 'products'))
    if (productsSnapshot.empty) {
      // Agregar productos
      for (const product of products) {
        await addProduct(product)
      }
    }
    
    const farmersSnapshot = await getDocs(collection(db, 'farmers'))
    if (farmersSnapshot.empty) {
      // Agregar agricultores
      for (const farmer of farmers) {
        await addFarmer(farmer)
      }
    }
    
    const hubsSnapshot = await getDocs(collection(db, 'hubs'))
    if (hubsSnapshot.empty) {
      // Agregar hubs
      for (const hub of hubs) {
        await addHub(hub)
      }
    }
    
    const ordersSnapshot = await getDocs(collection(db, 'orders'))
    if (ordersSnapshot.empty) {
      // Agregar pedidos
      for (const order of orders) {
        await addOrder(order)
      }
    }
    
    return { success: true, message: 'Datos inicializados correctamente' }
  } catch (error) {
    console.error('Error al inicializar datos:', error)
    return { success: false, message: error.message }
  }
}

export const updateUserType = async (uid, userType) => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { userType })
    return { success: true }
  } catch (error) {
    console.error('Error al actualizar userType:', error)
    throw error
  }
}

export const getUsersByType = async (userType) => {
  try {
    const q = query(collection(db, 'users'), where('userType', '==', userType))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener usuarios por tipo:', error)
    throw error
  }
}

export const createAdminUser = async (email, password) => {
  try {
    // Intentar crear usuario en Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      
      // Crear documento en Firestore con userType: 'admin'
      await setDoc(doc(db, 'users', uid), {
        email: email,
        name: 'Administrador',
        userType: 'admin',
        createdAt: new Date().toISOString()
      })
      
      // Crear documento en colección separada de admins
      await setDoc(doc(db, 'admins', email), {
        email: email,
        password: password,
        createdAt: new Date().toISOString()
      })
      
      return { success: true, uid, message: 'Usuario admin creado exitosamente' }
    } catch (authError) {
      // Si el email ya existe, intentar iniciar sesión y actualizar userType
      if (authError.code === 'auth/email-already-in-use') {
        const { signInWithEmailAndPassword } = await import('firebase/auth')
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const uid = userCredential.user.uid
        
        // Actualizar el documento en Firestore
        await setDoc(doc(db, 'users', uid), {
          email: email,
          name: 'Administrador',
          userType: 'admin',
          updatedAt: new Date().toISOString()
        }, { merge: true })
        
        // Crear documento en colección separada de admins
        await setDoc(doc(db, 'admins', email), {
          email: email,
          password: password,
          updatedAt: new Date().toISOString()
        }, { merge: true })
        
        return { success: true, uid, message: 'Usuario existente actualizado a admin' }
      }
      throw authError
    }
  } catch (error) {
    console.error('Error al crear/actualizar usuario admin:', error)
    throw error
  }
}

export const verifyAdmin = async (email, password) => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', email))
    if (!adminDoc.exists()) {
      return { success: false, message: 'Admin no encontrado' }
    }
    
    const adminData = adminDoc.data()
    if (adminData.password !== password) {
      return { success: false, message: 'Contraseña incorrecta' }
    }
    
    return { success: true, email: adminData.email }
  } catch (error) {
    console.error('Error al verificar admin:', error)
    return { success: false, message: error.message }
  }
}

// CREAR AGRICULTOR DE PRUEBA
export const createTestFarmer = async () => {
  try {
    const email = 'agricultor@agrolink.test'
    const password = 'agricultor123'
    const farmerData = {
      name: 'Juan Pérez',
      businessName: 'Finca El Paraíso',
      zone: 'Cotoca',
      phone: '+591 71234567',
      description: 'Productor de verduras y hortalizas frescas',
      deliveryMethods: ['delivery', 'pickup'],
      paymentMethods: ['cash', 'qr'],
      deliveryFee: 15,
      rating: 4.5
    }
    
    return await createFarmerUser(email, password, farmerData)
  } catch (error) {
    console.error('Error al crear agricultor de prueba:', error)
    throw error
  }
}
