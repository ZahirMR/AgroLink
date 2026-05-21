// Script de inicialización de datos en Firestore
// Ejecutar con: node scripts/initFirestore.js

import { initializeApp } from 'firebase/app';
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
const db = getFirestore(app);

// Datos de agricultores
const farmersData = [
  {
    id: 1,
    name: "Juan Pérez",
    businessName: "AgroPérez",
    zone: "Cotoca",
    email: "juan@agrolink.com",
    phone: "+591 70012345",
    rating: 4.5,
    deliveryMethods: ["delivery", "pickup"],
    paymentMethods: ["cash", "qr", "card"],
    deliveryFee: 15,
    description: "Productos frescos directamente del campo a tu mesa. Cultivados con amor y dedicación."
  },
  {
    id: 2,
    name: "María González",
    businessName: "Huerta María",
    zone: "Warnes",
    email: "maria@agrolink.com",
    phone: "+591 70023456",
    rating: 4.8,
    deliveryMethods: ["delivery", "pickup"],
    paymentMethods: ["cash", "qr"],
    deliveryFee: 20,
    description: "Verduras orgánicas y productos naturales de la mejor calidad."
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    businessName: "Granja Rodríguez",
    zone: "Montero",
    email: "carlos@agrolink.com",
    phone: "+591 70034567",
    rating: 4.2,
    deliveryMethods: ["pickup"],
    paymentMethods: ["cash"],
    deliveryFee: 0,
    description: "Tubérculos y cereales de la región, cosechados al momento."
  },
  {
    id: 4,
    name: "Ana Martínez",
    businessName: "Frutas del Oriente",
    zone: "Santa Cruz",
    email: "ana@agrolink.com",
    phone: "+591 70045678",
    rating: 4.7,
    deliveryMethods: ["delivery"],
    paymentMethods: ["cash", "qr", "card"],
    deliveryFee: 25,
    description: "Las mejores frutas tropicales de Bolivia. Directo de nuestros árboles."
  },
  {
    id: 5,
    name: "Pedro Sánchez",
    businessName: "Verduras Pedro",
    zone: "La Guardia",
    email: "pedro@agrolink.com",
    phone: "+591 70056789",
    rating: 4.3,
    deliveryMethods: ["delivery", "pickup"],
    paymentMethods: ["cash", "qr"],
    deliveryFee: 18,
    description: "Hortalizas frescas cada mañana. Calidad garantizada."
  }
];

// Datos de productos
const productsData = [
  { id: 1, name: "Tomate", category: "Verduras", price: 15, unit: "kg", farmerId: 1, image: "🍅", available: true, photoUrl: "", description: "Tomates rojos maduros, perfectos para ensaladas y salsas." },
  { id: 2, name: "Lechuga", category: "Verduras", price: 8, unit: "unidad", farmerId: 1, image: "�", available: true, photoUrl: "", description: "Lechuga fresca y crujiente, cosechada esta mañana." },
  { id: 3, name: "Pimiento", category: "Verduras", price: 20, unit: "kg", farmerId: 1, image: "�", available: true, photoUrl: "", description: "Pimientos verdes y rojos, dulces y sabrosos." },
  { id: 4, name: "Zanahoria", category: "Verduras", price: 12, unit: "kg", farmerId: 2, image: "�", available: true, photoUrl: "", description: "Zanahorias orgánicas, dulces y crujientes." },
  { id: 5, name: "Remolacha", category: "Verduras", price: 10, unit: "kg", farmerId: 2, image: "🫒", available: true, photoUrl: "", description: "Remolachas frescas, perfectas para ensaladas." },
  { id: 6, name: "Cebolla", category: "Verduras", price: 9, unit: "kg", farmerId: 2, image: "�", available: true, photoUrl: "", description: "Cebollas blancas y rojas, sabor intenso." },
  { id: 7, name: "Maíz", category: "Cereales", price: 5, unit: "unidad", farmerId: 3, image: "�", available: true, photoUrl: "", description: "Mazorcas de maíz dulce, cosechadas al momento." },
  { id: 8, name: "Yuca", category: "Tubérculos", price: 7, unit: "kg", farmerId: 3, image: "�", available: true, photoUrl: "", description: "Yuca fresca, perfecta para hervir o freír." },
  { id: 9, name: "Papa", category: "Tubérculos", price: 6, unit: "kg", farmerId: 3, image: "�", available: true, photoUrl: "", description: "Papas blancas, ideales para cualquier preparación." },
  { id: 10, name: "Frutilla", category: "Frutas", price: 25, unit: "kg", farmerId: 4, image: "🍓", available: true, photoUrl: "", description: "Frutillas dulces y jugosas, de temporada." },
  { id: 11, name: "Banana", category: "Frutas", price: 8, unit: "kg", farmerId: 4, image: "�", available: true, photoUrl: "", description: "Bananas maduras y dulces, perfectas para cualquier momento." },
  { id: 12, name: "Naranja", category: "Frutas", price: 10, unit: "kg", farmerId: 4, image: "🍊", available: true, photoUrl: "", description: "Naranjas jugosas, ricas en vitamina C." },
  { id: 13, name: "Pepino", category: "Verduras", price: 12, unit: "kg", farmerId: 5, image: "🥒", available: true, photoUrl: "", description: "Pepinos frescos y crujientes, ideales para ensaladas." },
  { id: 14, name: "Calabaza", category: "Verduras", price: 8, unit: "kg", farmerId: 5, image: "🎃", available: true, photoUrl: "", description: "Calabaza dulce, perfecta para sopas y purés." },
  { id: 15, name: "Melón", category: "Frutas", price: 15, unit: "unidad", farmerId: 5, image: "�", available: true, photoUrl: "", description: "Melón dulce y refrescante, de temporada." }
];

// Datos de hubs
const hubsData = [
  {
    id: 1,
    name: "Hub Equipetrol",
    address: "Calle Principal #123, Equipetrol",
    zone: "Zona Norte",
    capacity: 100
  },
  {
    id: 2,
    name: "Hub Zona Sur",
    address: "Av. Principal #456, Zona Sur",
    zone: "Zona Sur",
    capacity: 150
  },
  {
    id: 3,
    name: "Hub Villa 1ro de Mayo",
    address: "Calle Secundaria #789, Villa 1ro de Mayo",
    zone: "Zona Oeste",
    capacity: 120
  },
  {
    id: 4,
    name: "Hub Plan 3000",
    address: "Av. Las Americas #101, Plan 3000",
    zone: "Zona Este",
    capacity: 200
  },
  {
    id: 5,
    name: "Hub Santa Bárbara",
    address: "Calle Central #202, Santa Bárbara",
    zone: "Zona Centro",
    capacity: 80
  }
];

// Datos de pedidos
const ordersData = [
  {
    id: 1,
    customer: "Restaurante El Fogón",
    products: [
      { productId: 1, quantity: 5 },
      { productId: 2, quantity: 10 },
      { productId: 4, quantity: 3 }
    ],
    total: 155,
    status: "pending",
    date: "2026-05-21",
    hub: "Hub Equipetrol",
    deliveryTime: "09:00"
  },
  {
    id: 2,
    customer: "Cafetería La Plaza",
    products: [
      { productId: 7, quantity: 20 },
      { productId: 11, quantity: 5 }
    ],
    total: 140,
    status: "confirmed",
    date: "2026-05-21",
    hub: "Hub Zona Sur",
    deliveryTime: "10:00"
  },
  {
    id: 3,
    customer: "Familia García",
    products: [
      { productId: 10, quantity: 2 },
      { productId: 12, quantity: 3 }
    ],
    total: 80,
    status: "delivered",
    date: "2026-05-20",
    hub: "Hub Equipetrol",
    deliveryTime: "08:00"
  }
];

// Función para agregar datos a una colección
async function addDataToCollection(collectionName, data) {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`📝 Agregando datos a ${collectionName}...`);
      for (const item of data) {
        await addDoc(collectionRef, item);
      }
      console.log(`✅ ${data.length} registros agregados a ${collectionName}`);
    } else {
      console.log(`⚠️  La colección ${collectionName} ya tiene datos (${snapshot.size} registros)`);
    }
  } catch (error) {
    console.error(`❌ Error agregando datos a ${collectionName}:`, error.message);
  }
}

// Función principal
async function initializeFirestore() {
  console.log('🚀 Iniciando inicialización de Firestore...\n');
  
  await addDataToCollection('farmers', farmersData);
  await addDataToCollection('products', productsData);
  await addDataToCollection('hubs', hubsData);
  await addDataToCollection('orders', ordersData);
  
  console.log('\n✅ Inicialización de Firestore completada!');
  console.log('\n📋 Resumen:');
  console.log('--------------------------------');
  console.log(`👨‍🌾 Agricultores: ${farmersData.length}`);
  console.log(`📦 Productos: ${productsData.length}`);
  console.log(`📍 Hubs: ${hubsData.length}`);
  console.log(`🛒 Pedidos: ${ordersData.length}`);
  
  process.exit(0);
}

initializeFirestore().catch(error => {
  console.error('❌ Error en inicialización:', error);
  process.exit(1);
});
