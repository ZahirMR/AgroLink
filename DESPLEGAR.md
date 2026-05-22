# Cómo desplegar AgroLink como página web

## Opción 1: Vercel (Recomendado - Gratis y Fácil)

### Pasos:

1. **Ve a [Vercel.com](https://vercel.com)**
   - Crea una cuenta con tu cuenta de GitHub
   - Es gratis

2. **Importa tu repositorio**
   - Haz clic en "Add New Project"
   - Selecciona tu repositorio `AgroLink` de GitHub
   - Haz clic en "Import"

3. **Configura el proyecto**
   - **Framework Preset**: Vite (se detectará automáticamente)
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm run build` (debería aparecer automáticamente)
   - **Output Directory**: `dist` (debería aparecer automáticamente)
   - Haz clic en "Deploy"

4. **Espera unos minutos**
   - Vercel construirá y desplegará tu aplicación
   - Te dará una URL como: `https://agrolink.vercel.app`

5. **¡Listo!**
   - Tu aplicación estará online y accesible desde cualquier lugar
   - Cada vez que hagas un push a GitHub, Vercel actualizará automáticamente

---

## Opción 2: GitHub Pages (Gratis)

### Pasos:

1. **Instala gh-pages** (en tu terminal):
```bash
npm install --save-dev gh-pages
```

2. **Agrega scripts en package.json**:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. **Despliega**:
```bash
npm run deploy
```

4. **Activa GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: gh-pages branch
   - Tu URL será: `https://zahirmr.github.io/AgroLink/`

---

## Opción 3: Netlify (Gratis)

1. **Ve a [Netlify.com](https://netlify.com)**
2. Crea cuenta con GitHub
3. "Add new site" → "Import an existing project"
4. Selecciona tu repositorio `AgroLink`
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy

---

## Recomendación

**Usa Vercel** porque:
- Es muy fácil de configurar
- Detecta automáticamente que es Vite/React
- Actualizaciones automáticas cuando haces push
- HTTPS gratis
- Dominios personalizados gratis
- Muy rápido

---

## Después de desplegar

1. Comparte la URL con tus amigos/clientes
2. La aplicación estará conectada a tu base de datos Firebase
3. Los cambios que hagas en el código y subas a GitHub se actualizarán automáticamente
