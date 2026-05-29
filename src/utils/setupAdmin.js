import { db, auth } from '../firebase/config'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'

/**
 * Script para configurar el usuario admin en Firestore
 * Ejecutar esto en la consola del navegador después de iniciar sesión
 */
export const setupAdminUser = async (email, password) => {
  try {
    // Iniciar sesión para obtener el uid
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid
    
    // Actualizar el documento en Firestore con userType: 'admin'
    await setDoc(doc(db, 'users', uid), {
      email: email,
      name: 'Administrador',
      userType: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true })
    
    console.log('Usuario admin configurado exitosamente')
    console.log('Recarga la página para aplicar los cambios')
    
    return { success: true }
  } catch (error) {
    console.error('Error al configurar usuario admin:', error)
    return { success: false, error: error.message }
  }
}

// Para ejecutar en la consola del navegador:
// import { setupAdminUser } from './src/utils/setupAdmin.js'
// setupAdminUser('admin@agrolink.dev', '123123')
