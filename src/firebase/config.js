import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Configuración de Firebase - AgroLink
const firebaseConfig = {
  apiKey: "AIzaSyCejUlC2Gs4TlnQj5RZi7ZuFxCkmY8vE5U",
  authDomain: "agrolink-378dd.firebaseapp.com",
  projectId: "agrolink-378dd",
  storageBucket: "agrolink-378dd.firebasestorage.app",
  messagingSenderId: "599933812250",
  appId: "1:599933812250:web:7f8cdcf6f96397ef789ba3",
  measurementId: "G-F3L20ED473"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
