# Frontend - Salud Al Día 🏥🌐

Esta es la interfaz de usuario de **Salud Al Día**, una plataforma web moderna desarrollada con **React** y **Vite**. Permite a los usuarios gestionar su salud mediante un flujo de registro, autenticación y creación de fichas médicas detalladas.

##  Tecnologías y Herramientas

* **React (Vite)**: Framework principal enfocado en el rendimiento y velocidad de desarrollo.
* **Axios**: Cliente HTTP para la comunicación con el microservicio de usuarios.
* **React Router**: Gestión de navegación entre páginas (SPA).
* **CSS3**: Estilos personalizados organizados en la carpeta `/Styles`.

## ⚙️ Configuración del Entorno

Para que la aplicación funcione correctamente, debe conectarse al Backend mediante variables de entorno.

### Desarrollo Local (`.env`):
Crea un archivo llamado `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000
Producción (Railway):
Configura estas variables en el panel de Railway para conectar con el servidor en vivo:

VITE_API_URL: https://ms-users-service-salud-production.up.railway.app.

 Estructura de Rutas y Navegación
El flujo de usuario está diseñado de forma lógica:

/signup: Formulario de registro de nuevos pacientes.

/login: Acceso para usuarios registrados.

/ficha-medica: Formulario inicial de salud (se requiere registro previo).

/Dashboard: Panel principal de control del usuario.

 Instalación y Uso
Clonar el repositorio:

Bash

git clone [https://github.com/victor99a/front-salud-al-dia.git](https://github.com/victor99a/front-salud-al-dia.git)
Instalar dependencias:

Bash

npm install
Ejecutar en modo desarrollo:

Bash

npm run dev
 Notas de Despliegue en Railway
Target Port: La aplicación debe escuchar en el puerto 4173 (Vite Preview) para que el dominio público funcione.

URL Pública: https://front-salud-al-dia-production.up.railway.app.

Importante: Se debe respetar estrictamente el uso de mayúsculas en las rutas de carpetas (ej: /Styles/) para evitar errores de compilación en Linux/Railway.
