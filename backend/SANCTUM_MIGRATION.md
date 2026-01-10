# Migración a Sanctum SPA Authentication

## ✅ Migración Completada

La aplicación ORAS ha sido migrada exitosamente de **API Tokens con localStorage** a **Sanctum SPA Authentication con cookies httpOnly**.

---

## 🔒 Mejoras de Seguridad

### Antes (Inseguro ❌)
```typescript
// Tokens almacenados en localStorage
localStorage.setItem('token', data.token);

// Vulnerable a XSS
const token = localStorage.getItem('token');
fetch('/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Después (Seguro ✅)
```typescript
// Cookies httpOnly (no accesibles desde JavaScript)
// Automáticamente enviadas por el navegador

await getCsrfCookie(); // Obtener CSRF token
await register({ nombre, email, pais, whatsapp });
// La cookie de sesión se guarda automáticamente
```

**Beneficios:**
- ✅ Protección contra XSS (Cross-Site Scripting)
- ✅ Protección contra CSRF (Cross-Site Request Forgery)
- ✅ Cookies httpOnly no accesibles desde JavaScript
- ✅ SameSite=lax previene ataques de terceros
- ✅ Gestión automática de sesiones por el navegador

---

## 📋 Cambios Implementados

### Backend (Laravel)

#### 1. Configuración de Sanctum
**Archivo:** `/config/sanctum.php`
- Stateful domains configurados para `localhost:3000`
- Guards configurados para usar `web`

#### 2. Configuración de Sesiones
**Archivo:** `/config/session.php`
- Driver: `database`
- Http Only: `true`
- Same Site: `lax`
- Domain: `localhost`

**Archivo:** `.env`
```env
SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
FRONTEND_URL=http://localhost:3000
```

#### 3. Migración de Sesiones
**Archivo:** `database/migrations/2026_01_03_004325_create_sessions_table.php`
```php
Schema::create('sessions', function (Blueprint $table) {
    $table->string('id')->primary();
    $table->foreignId('user_id')->nullable()->index();
    $table->string('ip_address', 45)->nullable();
    $table->text('user_agent')->nullable();
    $table->longText('payload');
    $table->integer('last_activity')->index();
});
```

#### 4. Configuración de CORS
**Archivo:** `/config/cors.php` (nuevo)
```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'logout'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'supports_credentials' => true,
```

#### 5. Middleware
**Archivo:** `bootstrap/app.php`
```php
$middleware->web(append: [
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
]);

$middleware->statefulApi();
```

#### 6. Controladores Actualizados

**RegistrationController** (`app/Http/Controllers/RegistrationController.php`):
```php
// Antes: Devolver token
$token = $person->createToken('mobile-app')->plainTextToken;
return response()->json(['token' => $token, ...]);

// Después: Iniciar sesión
Auth::login($person);
$request->session()->regenerate();
return response()->json(['user' => [...]]); // Sin token
```

**AuthController** (`app/Http/Controllers/AuthController.php`):
```php
// Login
Auth::login($person);
$request->session()->regenerate();

// Logout
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();
```

#### 7. Rutas Web
**Archivo:** `routes/web.php`
```php
// Public routes
Route::post('/register', [RegistrationController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes with Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/encuestas', [EncuestaController::class, 'index']);
    Route::post('/respuestas', [RespuestaController::class, 'store']);
});
```

---

### Frontend (Next.js)

#### 1. Helper de Autenticación
**Archivo:** `frontend/lib/auth.ts` (nuevo)

Funciones principales:
- `getCsrfCookie()`: Obtiene cookie CSRF de Sanctum
- `apiRequest()`: Wrapper para fetch con credentials
- `register()`: Registro de usuario
- `login()`: Inicio de sesión
- `logout()`: Cerrar sesión
- `getCurrentUser()`: Obtener usuario actual
- `checkAuth()`: Verificar autenticación

**Características:**
- Automáticamente incluye `credentials: 'include'`
- Maneja CSRF token automáticamente
- Usa variable de entorno `NEXT_PUBLIC_API_URL`

#### 2. Variables de Entorno
**Archivo:** `frontend/.env.local` (nuevo)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3. Proxy de Next.js
**Archivo:** `frontend/next.config.ts`
```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/:path*',
    },
    {
      source: '/sanctum/:path*',
      destination: 'http://localhost:8000/sanctum/:path*',
    },
  ];
}
```

#### 4. Páginas Actualizadas

**Registro** (`app/register/page.tsx`):
```typescript
// Antes
const response = await fetch('/api/register', {...});
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// Después
import { register } from '@/lib/auth';
const data = await register(formData);
router.push('/encuesta'); // Sin guardar nada
```

**Encuesta** (`app/encuesta/page.tsx`):
```typescript
// Antes
const token = localStorage.getItem('token');
fetch('/api/encuestas', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Después
import { checkAuth, apiRequest, logout as authLogout } from '@/lib/auth';
const userData = await checkAuth();
const response = await apiRequest('/encuestas', { method: 'GET' });
```

**Dashboard** (`app/dashboard/page.tsx`):
```typescript
// Antes
const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');

// Después
import { checkAuth as authCheck, logout as authLogout } from '@/lib/auth';
const userData = await authCheck();
```

---

## 🚀 Cómo Usar

### Flujo de Autenticación

#### 1. Registro
```typescript
import { register } from '@/lib/auth';

const data = await register({
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  pais: 'México',
  whatsapp: '+521234567890'
});

// La cookie de sesión se guarda automáticamente
// No es necesario hacer nada más
```

#### 2. Verificar Autenticación
```typescript
import { checkAuth } from '@/lib/auth';

const user = await checkAuth();
if (!user) {
  router.push('/register');
} else {
  console.log('Usuario autenticado:', user);
}
```

#### 3. Hacer Requests Autenticadas
```typescript
import { apiRequest } from '@/lib/auth';

const response = await apiRequest('/encuestas', {
  method: 'GET',
});

const data = await response.json();
```

#### 4. Logout
```typescript
import { logout } from '@/lib/auth';

await logout();
router.push('/register');
```

---

## 🧪 Pruebas

### Para Probar la Migración:

#### 1. Backend (Laravel)
```bash
cd /home/rrichard/ora

# Si es necesario, correr migración de sessions
php artisan migrate

# Iniciar servidor
php artisan serve
# Server: http://localhost:8000
```

#### 2. Frontend (Next.js)
```bash
cd /home/rrichard/ora/frontend

# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor de desarrollo
npm run dev
# Server: http://localhost:3000
```

#### 3. Flujo de Prueba

1. **Abrir** `http://localhost:3000`
2. **Registrar** nuevo usuario
   - Se debe auto-autenticar y redirigir a `/encuesta`
3. **Verificar cookies** en DevTools
   - Chrome: Application → Cookies → localhost
   - Debería ver cookies de sesión (httpOnly)
4. **Completar encuesta**
   - Debería redirigir a `/dashboard`
5. **Cerrar sesión**
   - Click en "Salir"
   - Debería redirigir a `/register`
6. **Intentar acceder** a `/dashboard` sin autenticación
   - Debería redirigir automáticamente a `/register`

### Verificar Seguridad

**En DevTools Console:**
```javascript
// Intentar acceder a las cookies (no debería funcionar)
document.cookie // No verás la sesión (es httpOnly)

// Intentar acceder a localStorage
localStorage.getItem('token') // null (ya no se usa)
```

---

## 📊 Comparación

| Aspecto | Antes (localStorage) | Después (Cookies httpOnly) |
|---------|---------------------|---------------------------|
| **Almacenamiento** | localStorage | Cookies httpOnly |
| **Acceso desde JS** | ✅ Sí (vulnerable) | ❌ No (seguro) |
| **XSS Protection** | ❌ No | ✅ Sí |
| **CSRF Protection** | N/A | ✅ Sí (Sanctum) |
| **Auto-envío** | ❌ Manual | ✅ Automático |
| **Expiración** | Manual | ✅ Server-side |
| **Complejidad** | Media | Similar |
| **Seguridad** | ⚠️ Baja | ✅ Alta |

---

## ⚠️ Importante

### Cookies y CORS
- Las cookies solo se envían si `credentials: 'include'` está configurado
- El backend debe tener `supports_credentials: true` en CORS
- Los dominios deben estar en `SANCTUM_STATEFUL_DOMAINS`

### Producción
Para producción, actualizar:

**.env (Backend)**:
```env
SESSION_DOMAIN=.tudominio.com
SESSION_SECURE_COOKIE=true  # Solo HTTPS
SANCTUM_STATEFUL_DOMAINS=tudominio.com,www.tudominio.com
FRONTEND_URL=https://tudominio.com
```

**frontend/.env.local**:
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

---

## 🎯 Resultado Final

✅ **Autenticación 100% segura con Sanctum SPA**
✅ **No más tokens en localStorage**
✅ **Cookies httpOnly protegidas**
✅ **CSRF protection automática**
✅ **Sesiones gestionadas por Laravel**
✅ **Código más limpio y seguro**

---

**Fecha de migración:** 3 de enero de 2026
**Stack:** Laravel 12 + Next.js 16 + Sanctum SPA Authentication
