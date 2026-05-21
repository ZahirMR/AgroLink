// Script de inicialización para Firebase
// Ejecutar con: node scripts/initFirebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

// Configuración de Firebase - AgroLink
const firebaseConfig = {
  apiKey: "AIzaSyCejUlC2Gs4TlnQj5RZi7ZuFxCkmY8vE5U",
  authDomain: "agrolink-378dd.firebaseapp.com",
  projectId: "agrolink-378dd",
  storageBucket: "agrolink-378dd.firebasestorage.app",
  messagingSenderId: "599933812250",
  appId: "1:599933812250:web:7f8cdcf6f96397ef789ba3",
  measurementId: "G-F3L20ED473"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Datos de prueba
const adminUser = {
  email: 'admin@agrolink.com',
  password: 'admin123456',
  name: 'Administrador',
  userType: 'admin'
};

const farmers = [
  {
    email: 'juan@agrolink.com',
    password: 'juan123456',
    name: 'Juan Pérez',
    zone: 'Cotoca',
    userType: 'farmer'
  },
  {
    email: 'maria@agrolink.com',
    password: 'maria123456',
    name: 'María González',
    zone: 'Warnes',
    userType: 'farmer'
  },
  {
    email: 'carlos@agrolink.com',
    password: 'carlos123456',
    name: 'Carlos Rodríguez',
    zone: 'Montero',
    userType: 'farmer'
  }
];

const clients = [
  {
    email: 'cliente1@agrolink.com',
    password: 'cliente123456',
    name: 'Restaurante El Fogón',
    userType: 'client'
  },
  {
    email: 'cliente2@agrolink.com',
    password: 'cliente123456',
    name: 'Familia García',
    userType: 'client'
  }
];

// Función para crear usuario con reintentos
async function createUser(userData, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      
      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: userData.email,
        name: userData.name,
        userType: userData.userType,
        createdAt: new Date().toISOString()
      });
      
      console.log(`✅ Usuario creado: ${userData.email} (${userData.userType})`);
      return { uid: user.uid, ...userData };
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Usuario ya existe: ${userData.email}`);
        return null;
      } else if (error.code === 'auth/network-request-failed' && i < retries - 1) {
        console.log(`⏳ Error de red, reintentando (${i + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
        return null;
      }
    }
  }
  return null;
}

// Función para inicializar datos
async function initializeData() {
  console.log('🚀 Iniciando inicialización de Firebase...\n');
  
  // Crear admin
  console.log('📝 Creando administrador...');
  const admin = await createUser(adminUser);
  
  // Crear agricultores
  console.log('\n📝 Creando agricultores...');
  const farmerUsers = [];
  for (const farmer of farmers) {
    const user = await createUser(farmer);
    if (user) farmerUsers.push(user);
  }
  
  // Crear clientes
  console.log('\n📝 Creando clientes...');
  const clientUsers = [];
  for (const client of clients) {
    const user = await createUser(client);
    if (user) clientUsers.push(user);
  }
  
  console.log('\n✅ Inicialización completada!');
  console.log('\n📋 Credenciales de prueba:');
  console.log('--------------------------------');
  console.log('ADMIN:');
  console.log(`  Email: ${adminUser.email}`);
  console.log(`  Password: ${adminUser.password}`);
  console.log('\nAGRICULTORES:');
  farmers.forEach(f => {
    console.log(`  ${f.name}: ${f.email} / ${f.password}`);
  });
  console.log('\nCLIENTES:');
  clients.forEach(c => {
    console.log(`  ${c.name}: ${c.email} / ${c.password}`);
  });
  
  process.exit(0);
}

initializeData().catch(error => {
  console.error('❌ Error en inicialización:', error);
  process.exit(1);
});
