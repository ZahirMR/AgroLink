# Instrucciones para subir a GitHub

## Pasos para crear el repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Completa los campos:
   - **Repository name**: `AgroLink` (o el nombre que prefieras)
   - **Description**: Plataforma de compra directa a agricultores
   - Marca **"Public"** o **"Private"** según tu preferencia
   - **NO** marques "Initialize this repository with a README" (ya tenemos uno)
5. Haz clic en **"Create repository"**

## Pasos para conectar y subir el código

Después de crear el repositorio, GitHub te mostrará algunas instrucciones. Sigue estos pasos:

### Si ya tienes un repositorio local (como ahora):

1. En la página del repositorio nuevo en GitHub, copia la URL del repositorio (algo como `https://github.com/tu-usuario/AgroLink.git`)

2. En tu terminal, ejecuta estos comandos (reemplaza la URL con la de tu repositorio):

```bash
git remote add origin https://github.com/tu-usuario/AgroLink.git
git branch -M main
git push -u origin main
```

### Si te pide credenciales:

- Si usas HTTPS: te pedirá tu usuario y contraseña de GitHub
- Si usas SSH: necesitarás tener tu clave SSH configurada

## Verificar que se subió correctamente

Después del push, ve a tu repositorio en GitHub y deberías ver todos los archivos (excepto node_modules).

## Comandos útiles

```bash
# Ver el estado del repositorio
git status

# Ver los commits
git log

# Ver los repositorios remotos
git remote -v

# Hacer push después de cambios
git add .
git commit -m "Descripción del cambio"
git push
```

## Nota importante

El archivo `.gitignore` ya está configurado para no subir:
- `node_modules/` (dependencias)
- `.env` (variables de entorno)
- Archivos de configuración local
- Logs y archivos temporales

Esto mantiene el repositorio limpio y ligero.
