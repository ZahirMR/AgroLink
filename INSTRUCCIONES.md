# Instrucciones de Inicialización de AgroLink

## ✅ Datos Inicializados Exitosamente

### Usuarios Creados en Firebase Authentication:
- ✅ 3 Agricultores
- ✅ 2 Clientes
- ❌ Admin (falló por error de red - necesita creación manual)

### Datos Creados en Firestore:
- ✅ 10 Agricultores
- ✅ 35 Productos
- ✅ 5 Hubs
- ✅ 3 Pedidos

## 🔐 Credenciales de Prueba

### AGRICULTORES:
1. **Juan Pérez** (Cotoca)
   - Email: juan@agrolink.com
   - Password: juan123456

2. **María González** (Warnes)
   - Email: maria@agrolink.com
   - Password: maria123456

3. **Carlos Rodríguez** (Montero)
   - Email: carlos@agrolink.com
   - Password: carlos123456

### CLIENTES:
1. **Restaurante El Fogón**
   - Email: cliente1@agrolink.com
   - Password: cliente123456

2. **Familia García**
   - Email: cliente2@agrolink.com
   - Password: cliente123456

## 👨‍💼 Crear Usuario Admin Manualmente

El usuario admin no se pudo crear automáticamente. Sigue estos pasos:

### Opción 1: Desde Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto **agrolink-378dd**
3. En el menú izquierdo, ve a **Authentication** > **Users**
4. Click en **"Add user"** (Agregar usuario)
5. Ingresa:
   - **Email**: admin@agrolink.com
   - **Password**: admin123456
6. Click en **"Add user"**

### Opción 2: Desde la Aplicación Web

1. Abre la aplicación en http://localhost:5174/
2. Ve a la página de **Registro** (/register)
3. Regístrate con:
   - **Email**: admin@agrolink.com
   - **Password**: admin123456
   - **Nombre**: Administrador
   - **Tipo de usuario**: Administrador
4. Luego ve a Firebase Console y verifica que el usuario se creó

## 🚀 Iniciar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5174/

## 📱 Interfaces de la Aplicación

### 1. **Página de Inicio** (/)
- Landing page de AgroLink
- Información general del servicio

### 2. **Catálogo de Productos** (/productos)
- Lista de todos los productos disponibles
- Filtrado por categoría
- Carrito de compras

### 3. **Panel de Agricultor** (/agricultor)
- Solo accesible para agricultores autenticados
- Ver pedidos pendientes
- Confirmar disponibilidad de productos
- **Cambiar fotos de productos**
- Generar códigos QR

### 4. **Panel de Administración** (/admin)
- Solo accesible para admin autenticado
- **Dashboard con estadísticas:**
  - Total Agricultores
  - Total Productos
  - Total Hubs
  - Total Pedidos
  - Clientes Registrados
  - Agricultores Registrados
  - Total Usuarios
  - Productos con Foto
- **Gestión de Agricultores** (agregar, eliminar)
- **Gestión de Productos** (agregar, eliminar, **cambiar foto**)
- **Gestión de Hubs** (agregar, eliminar)
- **Gestión de Pedidos**

### 5. **Login** (/login)
- Página de inicio de sesión
- Opciones: Cliente, Agricultor, Administrador

### 6. **Registro** (/register)
- Página de registro de nuevos usuarios
- Tipos: Cliente, Agricultor

## 🔄 Scripts de Inicialización

### Ejecutar scripts nuevamente (si es necesario):

```bash
# Inicializar usuarios en Firebase Authentication
node scripts/initFirebase.js

# Inicializar datos en Firestore
node scripts/initFirestore.js
```

## 📊 Estructura de la Base de Datos

### Firebase Authentication:
- Usuarios con email/password
- Tipos: admin, farmer, client

### Firestore Collections:
- **users**: Datos adicionales de usuarios
- **farmers**: Información de agricultores
- **products**: Catálogo de productos
- **hubs**: Puntos de entrega
- **orders**: Pedidos de clientes

## 🎯 Funcionalidades Implementadas

### ✅ Para Agricultores:
- Ver pedidos pendientes
- Confirmar disponibilidad
- Registrar entrega en hub
- **Cambiar fotos de productos**
- Generar códigos QR

### ✅ Para Administradores:
- Dashboard con estadísticas completas
- Gestión de agricultores
- Gestión de productos
- **Cambiar fotos de productos**
- Gestión de hubs
- Gestión de pedidos

### ✅ Para Clientes:
- Ver catálogo de productos
- Filtrar por categoría
- Agregar al carrito
- Realizar pedidos

## 🐛 Solución de Problemas

### La página está en blanco:
- Verifica que el servidor esté corriendo
- Abre la consola del navegador (F12) para ver errores
- Espera 5 segundos (timeout de Firebase Auth)

### No se ven los productos:
- Ve al panel de administración
- Click en "Inicializar Datos de Ejemplo"
- O ejecuta: `node scripts/initFirestore.js`

### No puedo iniciar sesión como admin:
- Crea el admin manualmente siguiendo las instrucciones arriba
- Verifica las credenciales: admin@agrolink.com / admin123456

## 📞 Soporte

Si tienes problemas, verifica:
1. Que Firebase esté configurado correctamente
2. Que las reglas de Firestore permitan lectura/escritura
3. Que Authentication esté habilitado en Firebase Console
