# AgroLink - Plataforma de Conexión Agrícola

Plataforma digital que conecta directamente a los agricultores de Santa Cruz, Bolivia con restaurantes, cafeterías y consumidores urbanos.

## 🚀 Características

- **Sistema de Autenticación**: Login separado para clientes y administradores
- **Catálogo de Productos**: 40+ productos de diferentes categorías (Verduras, Frutas, Carnes, Lácteos, Aves, Cereales, Tubérculos)
- **Gestión de Pedidos**: Sistema de pedidos anticipados con cierre a las 20:00h
- **Panel de Administración**: Gestión completa de agricultores, productos, hubs y pedidos
- **Panel de Agricultores**: Vista de pedidos, confirmación de disponibilidad y generación de códigos QR
- **Trazabilidad**: Sistema de códigos QR para rastrear productos
- **Base de Datos**: 10 agricultores de diferentes zonas de Santa Cruz (Cotoca, Warnes, Portachuelo, Montero)

## 🔧 Configuración de Firebase

Para que la autenticación y la base de datos funcionen, necesitas configurar Firebase:

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado "AgroLink"
3. Habilita **Authentication**:
   - Ve a Authentication > Sign-in method
   - Habilita **Email/Password**
4. Habilita **Firestore Database**:
   - Ve a Firestore Database
   - Crea una base de datos en modo producción o prueba
   - Configura las reglas de seguridad (puedes usar modo de prueba inicialmente)

### 2. Obtener las credenciales de Firebase

1. Ve a Project Settings (icono de engranaje)
2. En la sección "Your apps", agrega una app web
3. Copia el objeto `firebaseConfig` que se genera

### 3. Configurar el proyecto

1. Abre el archivo `src/firebase/config.js`
2. Reemplaza los valores de ejemplo con tus credenciales reales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
}
```

### 4. Crear usuarios de prueba

Una vez configurado Firebase, crea estos usuarios en Authentication:

**Administrador:**
- Email: `admin@agrolink.com`
- Contraseña: `admin123`

**Cliente:**
- Email: `cliente@agrolink.com`
- Contraseña: `cliente123`

## 📦 Instalación

```bash
npm install
```

## 🏃 Ejecutar el proyecto

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🌐 Estructura del Proyecto

```
AgroLink/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Barra de navegación con login/logout
│   │   └── ProtectedRoute.jsx  # Componente para proteger rutas
│   ├── context/
│   │   └── AuthContext.jsx     # Contexto de autenticación
│   ├── data/
│   │   └── data.js            # Datos de ejemplo (agricultores, productos, hubs)
│   ├── firebase/
│   │   └── config.js          # Configuración de Firebase
│   ├── pages/
│   │   ├── Home.jsx           # Página de inicio
│   │   ├── Products.jsx       # Catálogo de productos
│   │   ├── Orders.jsx         # Gestión de pedidos
│   │   ├── Login.jsx          # Página de login
│   │   ├── Register.jsx       # Página de registro
│   │   ├── Admin.jsx          # Panel de administración
│   │   └── FarmerPanel.jsx    # Panel de agricultores
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Tema

La aplicación usa una combinación de colores verde y blanco como solicitado:
- **Primary Green**: #22c55e (verde principal)
- **White**: #ffffff (blanco)
- Variaciones de verde para diferentes elementos

## 👥 Usuarios del Sistema

### Clientes
- Pueden ver productos
- Pueden hacer pedidos
- Pueden ver sus pedidos
- Necesitan login para acceder a pedidos

### Administradores
- Acceso completo al panel de administración
- Gestión de agricultores
- Gestión de productos
- Gestión de hubs
- Gestión de pedidos
- Requieren email con "admin" para acceso

### Agricultores
- Vista de pedidos del día siguiente
- Confirmación de disponibilidad
- Registro de entrega en hub
- Generación de códigos QR
- Requieren login

## 📍 Zonas de Agricultores

- **Cotoca**: Verduras y Aves
- **Warnes**: Verduras, Carnes y Cereales
- **Portachuelo**: Tubérculos y Frutas
- **Montero**: Frutas y Lácteos

## 🏪 Hubs (Puntos de Acopio)

1. Hub Equipetrol - Zona Norte
2. Hub Zona Sur - Zona Sur
3. Hub Villa 1ro de Mayo - Zona Oeste
4. Hub Plan 3000 - Zona Este
5. Hub Santa Bárbara - Zona Centro

## 📝 Notas Importantes

- Los pedidos cierran a las 20:00h para entrega al día siguiente
- El sistema de autenticación usa Firebase Authentication
- La base de datos usa Firebase Firestore
- Los datos actuales son de ejemplo y están en `src/data/data.js`
- Para producción, deberías migrar los datos a Firestore

## 🔐 Seguridad

- Las rutas de administración están protegidas
- Los usuarios deben estar autenticados para acceder a ciertas funcionalidades
- Los administradores se identifican por su email (contiene "admin")

## 🚀 Próximos Pasos

Para producción:

1. Migrar datos de `data.js` a Firestore
2. Implementar reglas de seguridad de Firestore
3. Configurar Firebase Storage para imágenes
4. Implementar pasarela de pagos
5. Agregar notificaciones push
6. Implementar sistema de calificaciones
7. Agregar mapa interactivo para hubs
