# Registro de Cambios - Proyecto ORAS

## Resumen del Proyecto

**ORAS** es una aplicación web móvil-primero para un servicio de oración con inteligencia artificial. La aplicación permite a los usuarios registrarse y completar una encuesta sobre sus necesidades y preferencias espirituales.

**Stack Tecnológico:**
- Backend: Laravel 12 + PHP 8.4
- Frontend: Next.js 16 + React 19 + TypeScript
- Estilos: Tailwind CSS v4
- Autenticación: Laravel Sanctum
- Base de datos: SQLite

---

## Cambios Implementados

### 1. Configuración Inicial del Proyecto

#### Backend (Laravel 12)
- Instalación y configuración de Laravel 12
- Configuración de base de datos SQLite
- Instalación de Laravel Sanctum para autenticación API
- Configuración de CORS para comunicación con frontend

#### Frontend (Next.js 16)
- Creación de aplicación Next.js 16 con App Router
- Configuración de TypeScript
- Integración de Tailwind CSS v4
- Configuración de proxy API en `next.config.ts`

---

### 2. Sistema de Autenticación

#### Modelos y Migraciones
**Archivo:** `database/migrations/2024_01_01_000000_create_people_table.php`
```php
- Tabla `people`: nombre, email, pais, whatsapp, email_verified_at
- Validación de email único
- Campos timestamps automáticos
```

**Archivo:** `app/Models/People.php`
```php
- Modelo con autenticación Sanctum
- Campos fillable: nombre, email, pais, whatsapp
- Hidden: password, remember_token
- Casts: email_verified_at como datetime
```

#### API de Registro
**Archivo:** `app/Http/Controllers/Auth/RegisterController.php`
```php
- Endpoint POST /api/register
- Validación de campos: nombre, email, pais, whatsapp (opcional)
- Creación de usuario y token de Sanctum
- Respuesta con token y datos del usuario
```

#### Página de Registro
**Archivo:** `frontend/app/register/page.tsx`
```tsx
- Formulario de registro con validación
- Campos: nombre, email, país, whatsapp
- Selector de país personalizado con búsqueda
- Redirección automática a /encuesta tras registro exitoso
- Almacenamiento de token y datos de usuario en localStorage
- Nota informativa sobre autenticación OTP futura
```

---

### 3. Sistema de Encuestas

#### Modelos y Migraciones

**Tabla Encuesta**
```php
Archivo: database/migrations/2025_12_31_222950_create_encuesta_table.php
- Campo: pregunta (text)
- Timestamps automáticos
```

**Tabla Respuestas**
```php
Archivo: database/migrations/2025_12_31_222951_create_respuestas_table.php
- Relación con encuesta_id (foreign key)
- Relación con people_id (foreign key)
- Campo respuestas (JSON) para almacenar todas las respuestas
- Cascade on delete
```

**Modelo Respuesta**
```php
Archivo: app/Models/Respuesta.php
- Fillable: encuesta_id, people_id, respuestas
- Cast automático de respuestas a array
- Relaciones: belongsTo(People), belongsTo(Encuesta)
```

#### API de Encuestas

**Controlador de Encuestas**
```php
Archivo: app/Http/Controllers/EncuestaController.php
- GET /api/encuestas: Lista todas las encuestas disponibles
- Autenticación requerida con Sanctum
```

**Controlador de Respuestas**
```php
Archivo: app/Http/Controllers/RespuestaController.php
- POST /api/respuestas: Guarda respuestas del usuario
- Validación de encuesta_id y respuestas (array)
- Asociación automática con usuario autenticado
- Almacenamiento de respuestas en formato JSON
```

#### Página de Encuesta
**Archivo:** `frontend/app/encuesta/page.tsx`

**Características principales:**
- 8 preguntas relacionadas con vida de oración y servicio de IA
- Navegación por pasos: 4 pasos con 2 preguntas por paso
- Barra de progreso visual (25%, 50%, 75%, 100%)
- Tipos de preguntas soportadas:
  - `textarea`: Respuestas largas
  - `text`: Respuestas cortas
  - `radio`: Selección única
  - `select`: Dropdown personalizado
  - `multiple_choice`: Selección múltiple (checkboxes)
- Validación de campos requeridos
- Guardado automático al completar
- Pantalla de confirmación tras envío exitoso

**Preguntas implementadas:**

**Paso 1 (25%)** - Vida de oración:
1. ¿Cómo describirías tu vida de oración actualmente? (textarea)
2. ¿Con qué frecuencia sueles orar? (radio)

**Paso 2 (50%)** - Necesidades espirituales:
3. ¿Sobre qué temas te gustaría orar con más frecuencia? (multiple_choice)
4. ¿En qué momento del día prefieres orar? (select)

**Paso 3 (75%)** - Servicio con IA:
5. ¿Qué tan cómodo te sientes usando IA como apoyo en tu vida de oración? (radio)
6. ¿Qué esperas de un servicio de oración con IA? (textarea)

**Paso 4 (100%)** - Características deseadas:
7. ¿Qué funcionalidades te gustaría que incluyera nuestro servicio? (multiple_choice)
8. ¿Qué aspecto es más importante para ti en un servicio de oración? (radio)

---

### 4. Componentes Personalizados

#### CountrySelect Component
**Archivo:** `frontend/components/CountrySelect.tsx`

**Características:**
- Dropdown personalizado con búsqueda
- Lista de países desde `lib/countries.ts`
- Click fuera para cerrar
- Responsive para móviles
- Indicador de errores de validación
- Scrollbar oculto pero funcional

---

### 5. Mejoras de Diseño y UX

#### Dropdowns Personalizados
**Cambio:** Reemplazo de `<select>` nativo por componentes custom

**Implementación:**
- Botón con flecha animada (rotación al abrir)
- Lista desplegable con shadow y bordes redondeados
- Overlay invisible para cerrar al hacer click fuera
- Opción seleccionada resaltada
- Transiciones suaves
- Scrollbar oculto con `hide-scrollbar` class

**Antes:**
```tsx
<select className="border rounded">
  <option>Opción 1</option>
</select>
```

**Después:**
```tsx
<button onClick={() => setDropdownOpen(!isOpen)}>
  {value || 'Selecciona una opción...'}
  <svg className={isOpen ? 'rotate-180' : ''}>...</svg>
</button>
{isOpen && (
  <div className="absolute bg-white rounded-xl shadow-lg">
    {opciones.map(opcion => (
      <button onClick={() => handleSelect(opcion)}>
        {opcion}
      </button>
    ))}
  </div>
)}
```

#### Gestión de Estado de Dropdowns
- Estado inicial: `useState<Record<string, boolean>>({})`
- Múltiples dropdowns pueden coexistir sin conflictos
- Cierre automático de otros dropdowns al abrir uno nuevo

---

### 6. Responsividad Móvil

#### Breakpoints Implementados

**Ancho de pantalla:**
- Base (móvil): 320px - 639px
- `sm:` 640px+
- `md:` 768px+

**Altura de pantalla:**
- `max-h-[600px]:` para pantallas con altura < 600px

#### Ajustes Responsivos por Elemento

**Textos:**
- Títulos principales: `text-xl sm:text-2xl md:text-3xl`
- Títulos de preguntas: `text-base max-h-[600px]:text-sm sm:text-lg md:text-xl`
- Textos pequeños: `text-[10px] max-h-[600px]:text-[10px] sm:text-xs md:text-sm`
- Textos normales: `text-xs sm:text-sm md:text-base`

**Espaciado:**
- Padding: `p-2 max-h-[600px]:p-2 sm:p-3 md:p-4`
- Margin bottom: `mb-3 max-h-[600px]:mb-2 sm:mb-4 md:mb-6`
- Gaps: `gap-2 sm:gap-3`
- Espaciado vertical: `space-y-4 max-h-[600px]:space-y-3 sm:space-y-6`

**Inputs y Botones:**
- Padding vertical: `py-2 max-h-[600px]:py-2 sm:py-3 md:py-4`
- Padding horizontal: `px-3 sm:px-4 md:px-6`
- Tamaños de fuente: `text-sm sm:text-base md:text-lg`

**Iconos:**
- Header: `w-6 h-6 max-h-[600px]:w-6 sm:w-7 sm:h-7 md:w-8 md:h-8`
- Dropdown arrows: `w-4 h-4 sm:w-5 sm:h-5`
- Checkboxes/radios: `w-4 h-4 sm:w-5 sm:h-5`

#### Mejoras Específicas

**Contenedor de Notas:**
- Agregado `break-words` para prevenir overflow
- Padding reducido en pantallas pequeñas
- `leading-relaxed` para mejor legibilidad

**Formularios:**
- Inputs con altura reducida en móviles
- Botones con padding optimizado
- Labels con tamaños de fuente escalables

**Barra de Progreso:**
- Altura: `h-1 max-h-[600px]:h-1 sm:h-1.5 md:h-2`
- Indicadores de paso con texto mínimo en móviles

---

### 7. Tipografía

#### Plus Jakarta Sans
**Implementación:** `frontend/app/layout.tsx`

```typescript
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
```

**Configuración Global:** `frontend/app/globals.css`

```css
@theme inline {
  --font-sans: var(--font-plus-jakarta-sans);
}

body {
  font-family: var(--font-plus-jakarta-sans), system-ui, sans-serif;
}
```

**Pesos disponibles:**
- 400: Regular (textos normales)
- 500: Medium (labels)
- 600: Semibold (botones)
- 700: Bold (títulos)

---

### 8. Flujo de Navegación

#### Páginas Principales

**1. Landing Page (`/`)**
- Redirección automática a `/register`

**2. Registro (`/register`)**
- Formulario de registro
- Redirección a `/encuesta` tras éxito

**3. Encuesta (`/encuesta`)**
- Verificación de autenticación (redirect a `/register` si no hay token)
- Carga de encuesta disponible
- Navegación por pasos (2 preguntas por vista)
- Botón "Salir" en paso 1 (logout)
- Botón "Atrás" en pasos 2-4
- Botón "Siguiente" en pasos 1-3
- Botón "Finalizar" en paso 4
- Pantalla de confirmación tras envío

#### Gestión de Autenticación

**Token Storage:**
- Token guardado en `localStorage` tras registro
- Datos de usuario guardados en `localStorage`

**Logout:**
- Limpieza de `localStorage`
- Llamada a API `/api/logout`
- Redirección a `/register`

**Protección de Rutas:**
- Verificación de token en `useEffect`
- Manejo de errores 401 (token inválido)
- Redirección automática si no autenticado

---

### 9. Estilos Globales

**Archivo:** `frontend/app/globals.css`

**Scrollbar Oculto:**
```css
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
```

**Variables CSS:**
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

**Aplicación:**
```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-plus-jakarta-sans), system-ui, sans-serif;
}
```

---

### 10. Rutas API Configuradas

**Backend Routes:** `routes/api.php`

```php
// Autenticación
POST /api/register          - Registro de usuario

// Protegidas con Sanctum
POST /api/logout           - Cerrar sesión
GET  /api/encuestas        - Listar encuestas
POST /api/respuestas       - Guardar respuestas
```

**Configuración CORS:**
- Permitido: `http://localhost:3000`
- Métodos: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization, Accept

---

### 11. Estructura de Datos

#### Almacenamiento de Respuestas (JSON)

**Formato en base de datos:**
```json
{
  "vida_oracion": "Mi vida de oración es...",
  "frecuencia_oracion": "Diariamente",
  "temas_oracion": ["Salud y sanación", "Familia", "Paz interior"],
  "momento_oracion": "Al despertar (mañana)",
  "comodidad_ia": "Muy cómodo",
  "expectativas_servicio": "Espero que...",
  "funcionalidades_deseadas": ["Oraciones personalizadas", "Recordatorios diarios"],
  "aspecto_importante": "Privacidad y confidencialidad"
}
```

#### Modelo de Usuario (People)

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "pais": "México",
  "whatsapp": "+521234567890",
  "created_at": "2025-01-01T00:00:00.000000Z"
}
```

---

### 12. Características de Accesibilidad

- **Focus visible:** Anillos de enfoque en todos los inputs (`focus:ring-2`)
- **Active states:** Feedback visual en botones y opciones
- **Hover states:** Indicadores visuales en elementos interactivos
- **Labels semánticos:** Todos los inputs tienen labels asociados
- **Campos requeridos:** Indicador visual con asterisco rojo
- **Validación en tiempo real:** Mensajes de error claros
- **Responsive touch targets:** Tamaños mínimos para móviles (44x44px)
- **Contraste:** Cumple con WCAG 2.1 AA

---

### 13. Optimizaciones de Rendimiento

- **Lazy loading:** Componentes cargados solo cuando se necesitan
- **Estado local:** Minimización de re-renders innecesarios
- **Debouncing:** En búsqueda de países
- **Memoization:** Cálculos de progreso y validación
- **Asset optimization:** Tailwind CSS purge en producción
- **Font optimization:** Next.js font loading optimization
- **API caching:** Headers de cache en respuestas

---

## Configuración del Entorno

### Variables de Entorno Backend (.env)

```env
APP_NAME=ORAS
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/ruta/a/database.sqlite

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### Configuración Frontend (next.config.ts)

```typescript
rewrites: async () => [
  {
    source: '/api/:path*',
    destination: 'http://localhost:8000/api/:path*',
  },
],
```

---

## Comandos de Desarrollo

### Backend
```bash
composer setup          # Instalación completa
composer dev           # Servidor de desarrollo
php artisan migrate    # Ejecutar migraciones
```

### Frontend
```bash
npm install            # Instalar dependencias
npm run dev           # Servidor de desarrollo (localhost:3000)
npm run build         # Build de producción
```

---

## Próximas Implementaciones (TODO)

### Autenticación OTP por Email
- Generación de códigos OTP
- Envío de emails con códigos
- Verificación de códigos
- Migración creada: `create_otp_codes_table`
- Modelo OtpCode ya creado
- **Pendiente:** Implementación de lógica de envío y verificación

### Mejoras Futuras Potenciales
- Dashboard de usuario
- Historial de respuestas
- Notificaciones push
- Modo oscuro
- Internacionalización (i18n)
- Progressive Web App (PWA)

---

## Tecnologías y Librerías

### Backend
- Laravel 12
- Laravel Sanctum (autenticación)
- SQLite
- PHP 8.4+

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Google Fonts (Plus Jakarta Sans)

### Herramientas de Desarrollo
- Vite (bundler)
- ESLint
- Prettier
- Laravel Pint (PHP formatter)

---

**Última actualización:** 2 de enero de 2026
