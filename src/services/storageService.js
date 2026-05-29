import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'

/**
 * Sube una imagen a Firebase Storage
 * @param {File} file - El archivo de imagen a subir
 * @param {string} path - La ruta donde guardar la imagen (ej: 'products/', 'profiles/')
 * @returns {Promise<string>} - La URL de descarga de la imagen
 */
export const uploadImage = async (file, path = 'images/') => {
  try {
    // Crear un nombre único para el archivo
    const timestamp = Date.now()
    const filename = `${path}${timestamp}_${file.name}`
    
    // Crear referencia al storage
    const storageRef = ref(storage, filename)
    
    // Subir el archivo
    await uploadBytes(storageRef, file)
    
    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(storageRef)
    
    return downloadURL
  } catch (error) {
    console.error('Error al subir imagen:', error)
    throw new Error('Error al subir la imagen: ' + error.message)
  }
}

/**
 * Sube una imagen de perfil
 * @param {File} file - El archivo de imagen
 * @param {string} userId - El ID del usuario
 * @returns {Promise<string>} - La URL de descarga
 */
export const uploadProfileImage = async (file, userId) => {
  return uploadImage(file, `profiles/${userId}/`)
}

/**
 * Sube una imagen de producto
 * @param {File} file - El archivo de imagen
 * @param {string} productId - El ID del producto
 * @returns {Promise<string>} - La URL de descarga
 */
export const uploadProductImage = async (file, productId) => {
  return uploadImage(file, `products/${productId}/`)
}
