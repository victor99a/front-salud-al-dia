# 🏥 Frontend - Salud Al Día

**Salud Al Día** es una plataforma web progresiva (PWA) diseñada para el monitoreo de salud geriátrica. Desarrollada con **React y Vite**, ofrece una interfaz accesible de alto contraste para gestionar signos vitales, historias clínicas y alertas de emergencia, conectándose a un ecosistema de microservicios distribuidos.

---

## 🚀 Características Principales

Este frontend consume múltiples servicios para ofrecer:

* **🔐 Gestión de Identidad:** Registro y autenticación segura (Integración con Supabase/Microservicio Usuarios).
* **📊 Dashboard de Salud:** Visualización en tiempo real de Glucosa y Presión Arterial.
* **🚨 Botón SOS Global:** Sistema de alerta de emergencia accesible desde el Navbar.
* **🤖 Asistente IA (Dr. Chapatín):** Chat flotante integrado con Google Gemini para asistencia médica.
* **📂 Historial Médico:** Listado cronológico de mediciones pasadas.
* **🛡️ Panel Administrativo:** Gestión de usuarios y estadísticas (Rol exclusivo Admin).

---

## 🛠️ Tecnologías y Herramientas

* **Core:** React 18 + Vite (Rendimiento optimizado).
* **Networking:** Axios (Cliente HTTP para consumo de APIs REST).
* **Routing:** React Router DOM (Gestión de navegación SPA y Rutas Protegidas).
* **Estilos:** CSS3 Nativo (Diseño Modular en carpeta `/Styles` y enfoque Mobile-First).
* **Integraciones:** Supabase Client (Auth), Google AI SDK (opcional si es directo).

---

## ⚙️ Configuración del Entorno (.env)

Para conectar el frontend con el ecosistema de microservicios, debes configurar las variables de entorno.

**1. Desarrollo Local:**
Crea un archivo `.env` en la raíz del proyecto:

```env
# URL del Gateway o Microservicio Principal
VITE_API_URL=http://localhost:3000

# Credenciales de Supabase (Si aplica)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_key

📂 Estructura de RutasEl flujo de navegación está protegido y segmentado por roles:RutaDescripciónAcceso/Landing Page / HomePúblico/loginInicio de SesiónPúblico/signupRegistro de PacientesPúblico/ficha-medicaOnboarding clínico inicialPrivado (Nuevo Usuario)/dashboardPanel principal de controlPrivado (Paciente)/historialHistorial de medicionesPrivado (Paciente)/adminGestión de usuarios y KPIsPrivado (Admin)💻 Instalación y Uso LocalClonar el repositorio:Bashgit clone [https://github.com/victor99a/front-salud-al-dia.git](https://github.com/victor99a/front-salud-al-dia.git)
cd front-salud-al-dia
Instalar dependencias:Bashnpm install
Ejecutar en modo desarrollo:Bashnpm run dev
La aplicación correrá en http://localhost:5173 por defecto.☁️ Notas de Despliegue en RailwayPara un despliegue exitoso en producción, ten en cuenta las siguientes configuraciones críticas:Comando de Inicio (Start Command):Railway debe ejecutar el servidor de previsualización de Vite para servir la build.Bashnpm run build && npm run preview -- --port $PORT --host
Case Sensitivity (Linux):⚠️ Importante: El sistema de archivos de Railway (Linux) distingue mayúsculas de minúsculas.Si tu carpeta se llama /Styles, impórtala exactamente así: import './Styles/App.css'.Si usas /styles en el código pero la carpeta es /Styles, la compilación fallará.Puerto:Asegúrate de que la variable PORT sea reconocida o configura el puerto 4173 (default de Vite Preview) si usas un Dockerfile personalizado.👥 Equipo de DesarrolloProduct Owner: Victor BarreraScrum Master: Yaquelin RugelLead Developer: Yeider CatariSalud Al Día © 2026 - Proyecto de Título
