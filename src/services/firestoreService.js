import { db } from '../firebase/config'
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
  getDocs as getCollectionDocs
} from 'firebase/firestore'

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
    return id
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

// PEDIDOS
export const addOrder = async (order) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), order)
    return { id: docRef.id, ...order }
  } catch (error) {
    console.error('Error al agregar pedido:', error)
    throw error
  }
}

export const getOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
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
