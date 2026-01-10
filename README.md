# Ora - App de Oración Guiada

**Estado del MVP:** 68% completado

Aplicación móvil de oración guiada con acceso gratuito a la Biblia RVR1960 y contenido premium de oraciones. Diseñada exclusivamente para dispositivos móviles (320-428px) con arquitectura separada backend/frontend.

---

## Características Principales

### Implementadas ✅
- **Autenticación sin contraseñas**: Registro e inicio de sesión con OTP (One-Time Password) por email
- **Biblia RVR1960 completa**: Lector gratuito con tracking automático de lecturas
- **Oraciones Guiadas**: 10 oraciones (5 gratuitas + 5 premium) con seguimiento de progreso
- **Encuestas de Onboarding**: Cuestionario de 8 preguntas para personalización
- **Dashboard de Usuario**: Estadísticas de racha, palabra del día, acceso rápido
- **Dashboard Administrativo**: Métricas completas de usuarios, funnel de conversión, analytics de oraciones y biblia

### En Desarrollo 🚧
- Sistema de suscripciones premium (Stripe/MercadoPago)
- Intenciones de oración personalizadas
- Notificaciones push y recordatorios
- Contenido expandido (15-20 oraciones con audio profesional)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente Móvil                         │
│              (Next.js 16 - Puerto 3000)                  │
│   ┌─────────────────────────────────────────────┐       │
│   │  Páginas: /dashboard /biblia /oracion       │       │
│   │  Proxy Next.js: /api/* → localhost:8000     │       │
│   └─────────────────────────────────────────────┘       │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/Cookies (Sanctum)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Backend Laravel 12 API                      │
│              (Laravel - Puerto 8000)                     │
│   ┌─────────────────────────────────────────────┐       │
│   │  API REST: /api/register /api/oraciones     │       │
│   │  Admin Inertia: /admin/dashboard            │       │
│   │  Auth: Sanctum + OTP (modelo People)        │       │
│   │  DB: SQLite (desarrollo)                    │       │
│   └─────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
          API Externa: bible-api.deno.dev
```

### Stack Tecnológico

**Backend:**
- Laravel 12 (PHP 8.2+)
- Laravel Sanctum (autenticación sin tokens JWT)
- Inertia.js + React 19 (dashboard administrativo)
- SQLite (desarrollo) / MySQL (producción)
- Modelos principales: `People`, `Oracion`, `OracionUsuario`, `BibleReading`, `Encuesta`

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Mobile-only responsive (320px - 428px)

**Herramientas:**
- Vite (build de assets)
- Composer (dependencias PHP)
- npm/Concurrently (orquestación de servicios)

---

## Requisitos Previos

- **PHP** 8.2 o superior
- **Composer** 2.x
- **Node.js** 18 o superior
- **npm** 9 o superior
- **Git**

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ora.git
cd ora
```

### 2. Configurar Backend

```bash
cd backend
composer setup
```

Este comando ejecuta automáticamente:
- `composer install` - Instala dependencias PHP
- Crea archivo `.env` desde `.env.example`
- `php artisan key:generate` - Genera clave de aplicación
- `php artisan migrate --force` - Ejecuta migraciones de base de datos
- `npm install` - Instala dependencias del admin (Inertia.js)
- `npm run build` - Compila assets del admin

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

---

## Configuración

### Backend: `.env`

Edita `backend/.env` y configura:

```env
# Base de datos (SQLite por defecto)
DB_CONNECTION=mysql
DB_DATABASE=db_name

# URLs de la aplicación
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Configuración de email (para OTP)
MAIL_MAILER=log
# Para producción, configura SMTP:
# MAIL_MAILER=smtp
# MAIL_HOST=smtp.mailtrap.io
# MAIL_PORT=2525
# MAIL_USERNAME=tu-usuario
# MAIL_PASSWORD=tu-password
```

### Crear Usuario Administrador

```bash
cd backend
php artisan tinker
```

En el REPL de Tinker:

```php
People::create([
    'name' => 'Admin',
    'email' => 'admin@ora.app',
    'country' => 'CR',
    'phone' => '1234567890',
    'is_admin' => true
]);
```

### Frontend: Variables de Entorno

El frontend usa proxy automático de Next.js, no requiere configuración adicional. Todos los endpoints usan rutas relativas (`/api/*`, `/sanctum/*`).

---

## Ejecución en Desarrollo

### Opción 1: Un solo comando (Recomendado)

Desde la raíz del proyecto:

```bash
cd backend
composer dev
```

Este comando inicia simultáneamente:
- **Backend Laravel** en `http://localhost:8000`
- **Frontend Next.js** en `http://localhost:3000`

### Opción 2: Servicios separados

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Cómo Probarlo

### 1. Registrar un Usuario

1. Abre tu navegador en **http://localhost:3000**
2. Haz clic en "Registrarse"
3. Completa el formulario:
   - Nombre
   - Email
   - País (selecciona para obtener prefijo telefónico)
   - WhatsApp (opcional)
4. Envía el formulario

### 2. Verificar OTP

Como `MAIL_MAILER=log`, el código OTP se guarda en logs:

```bash
tail -f backend/storage/logs/laravel.log
```

Busca el código de 6 dígitos (ej: `123456`)

### 3. Iniciar Sesión

1. En la página de login, ingresa tu email
2. Ingresa el código OTP del log
3. Accederás al dashboard

### 4. Explorar Features

**Dashboard de Usuario:**
- `/dashboard` - Estadísticas, palabra del día, acceso rápido

**Biblia RVR1960:**
- Haz clic en "Leer Biblia"
- Navega por libros del Antiguo/Nuevo Testamento
- Selecciona capítulos
- Las lecturas se trackean automáticamente

**Oraciones Guiadas:**
- Haz clic en "Oraciones Guiadas"
- Explora 10 oraciones (5 gratuitas, 5 premium con badge dorado)
- Filtra por categoría
- Marca como completada para trackear progreso

**Encuesta de Onboarding:**
- Completa `/encuesta` (8 preguntas en 4 pasos)
- Datos almacenados para personalización futura

### 5. Dashboard Administrativo

1. Abre **http://localhost:8000/admin/login**
2. Ingresa el email del usuario admin creado anteriormente
3. Explora:
   - **Dashboard**: Métricas generales (usuarios, encuestas, biblia, oraciones)
   - **Funnel**: Conversión desde registro hasta primera oración
   - **Usuarios**: CRUD completo con búsqueda y filtros
   - **Analytics de Contenido**: Estadísticas detalladas de oraciones

---

## Comandos Útiles

### Backend (Laravel)

```bash
# Migraciones
php artisan migrate                  # Ejecutar migraciones pendientes
php artisan migrate:fresh --seed     # Resetear DB y ejecutar seeders

# Base de datos
php artisan db:seed                  # Ejecutar seeders solamente

# Rutas
php artisan route:list               # Listar todas las rutas API

# Testing
composer test                        # Ejecutar tests PHPUnit
php artisan test --filter=NombreTest # Ejecutar test específico

# Código
./vendor/bin/pint                    # Formatear código PHP (Laravel Pint)

# Desarrollo
php artisan tinker                   # REPL interactivo
php artisan queue:listen             # Ejecutar worker de colas
```

### Frontend (Next.js)

```bash
# Desarrollo
npm run dev                          # Servidor de desarrollo con HMR

# Producción
npm run build                        # Compilar para producción
npm run start                        # Servidor de producción

# Calidad de código
npm run lint                         # ESLint
```

---

## Estructura del Proyecto

```
ora/
├── backend/                   # Laravel 12 API + Admin
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # AuthController, OracionController, AdminController
│   │   │   └── Middleware/    # IsAdmin, HandleInertiaRequests
│   │   └── Models/            # People, Oracion, BibleReading, etc.
│   ├── database/
│   │   ├── migrations/        # Schema de BD
│   │   └── seeders/           # OracionSeeder (10 oraciones)
│   ├── routes/
│   │   ├── api.php            # Endpoints REST (/api/*)
│   │   └── web.php            # Rutas admin Inertia (/admin/*)
│   ├── resources/
│   │   └── js/Pages/Admin/    # Dashboard.jsx, Content.jsx, Users.jsx
│   └── composer.json          # Scripts: setup, dev, test
│
└── frontend/                  # Next.js 16 SPA
    ├── app/                   # App Router (Next.js 16)
    │   ├── page.tsx           # Página de registro (/)
    │   ├── login/
    │   ├── dashboard/
    │   ├── biblia/
    │   ├── oracion/
    │   └── encuesta/
    ├── components/            # Componentes compartidos
    ├── lib/
    │   └── auth.ts            # Funciones de autenticación (CSRF, login)
    └── next.config.ts         # Proxy configurado: /api/* → localhost:8000
```

---

## Testing

### Backend (PHPUnit)

```bash
cd backend
composer test
```

**Endpoints principales a probar:**
- `POST /api/register` - Registro de usuario
- `POST /api/login/send-otp` - Envío de OTP
- `POST /api/login/verify-otp` - Verificación de OTP
- `GET /api/oraciones` - Lista de oraciones (requiere auth)
- `POST /api/oraciones/{id}/completar` - Completar oración
- `GET /api/biblia/registrar` - Trackear lectura de biblia

### Frontend (Manual)

Abre **Developer Tools** del navegador:
1. Network → Verifica que requests a `/api/*` no tengan errores CORS
2. Application → Cookies → Verifica `XSRF-TOKEN` y cookie de sesión
3. Console → Sin errores de JavaScript

---

## Roadmap

Ver **[MVP_PLAN.md](./MVP_PLAN.md)** para detalles completos del progreso.

### MVP Actual (68% completado)
- ✅ Autenticación OTP
- ✅ Biblia RVR1960 completa
- ✅ Oraciones guiadas (10 oraciones)
- ✅ Dashboard admin con analytics

### Próximos Pasos (32% restante)
- 🚧 **Sistema de suscripciones** (Stripe/MercadoPago)
- 🚧 Grabación de audios profesionales para oraciones premium
- 🚧 Intenciones de oración (CRUD personalizado)
- 🚧 Métricas financieras en dashboard admin (MRR, churn)
- 🚧 Notificaciones push y recordatorios

### Post-MVP
- Encapsular en Capacitor (App Store / Play Store)
- Modo offline avanzado
- Features sociales (compartir oraciones)

---

## Contribuir

### Guía de Desarrollo

1. Lee **[CLAUDE.md](./backend/CLAUDE.md)** para convenciones del proyecto
2. Lee **[MVP_PLAN.md](./MVP_PLAN.md)** para entender el estado actual

### Reglas Importantes

- **Mobile-only**: No diseños desktop para la app de usuario (solo admin puede ser responsive)
- **Modelo People**: NO usar `User`, siempre usar modelo `People` para usuarios
- **CORS**: Todos los endpoints del frontend deben usar `/api/*` (proxy Next.js)
- **Idioma español**: UI, BD, y código en español
- **Auth**: CSRF cookie + Sanctum session cookies (sin JWT)

### Workflow de Git

```bash
# Crear rama de feature
git checkout -b feature/nombre-feature

# Commits
git commit -m "feat: descripción del cambio"

# Tests antes de push
cd backend && composer test

# Push
git push origin feature/nombre-feature
```

---


## Licencia

MIT License

---

## Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

**Desarrollado con Laravel 12, Next.js 16 y Tailwind CSS v4**
