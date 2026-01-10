# CLAUDE.md

Guía optimizada para Claude Code. **Para análisis profundo de archivos, usa Gemini CLI** (ver sección abajo).

## Project Overview

Ora: App móvil (español) con arquitectura separada:
- **Backend**: Laravel 12 API + admin Inertia.js (puerto 8000)
- **Frontend**: Next.js 16 SPA (puerto 3000)
- **Auth**: Sanctum cookies + OTP (sin password)
- **DB**: SQLite, modelos en español
- **Mobile-only**: 320-428px, no responsive desktop

## Comandos Clave

**Setup**: `cd backend && composer setup && cd ../frontend && npm install`
**Dev**: `cd backend && composer dev` (corre ambos servidores)
**Tests**: `cd backend && composer test`
**Migrate**: `php artisan migrate:fresh --seed`
**Routes**: `php artisan route:list`

## Arquitectura (resumen)

**Backend**:
- Modelos: `People` (auth principal), `User` (no usar), `Encuesta`, `Respuesta`, `Oracion`, `OracionUsuario`, `BibliaLectura`
- Rutas API: `routes/api.php` (middleware `auth:sanctum`)
- Admin Inertia: `routes/web.php` (páginas en `resources/js/Pages/`)

**Frontend**:
- Páginas: `/` (registro), `/login`, `/dashboard`, `/biblia`, `/oracion`, `/encuesta`
- Auth: `frontend/lib/auth.ts` (CSRF + cookies)
- **CRÍTICO**: Proxy Next.js (`next.config.ts`) - todos los endpoints deben usar `/api/*` o `/sanctum/*` para evitar CORS

**Auth Flow**: CSRF cookie → login/register → session cookie → requests con CSRF header

**IMPORTANTE**:
- Modelo `People` (no `User`) con OTP, sin password
- API_URL debe ser `''` (string vacío) para usar proxy Next.js
- Todos endpoints frontend: `/api/...` (no `http://localhost:8000/...`)

## Reglas Críticas

1. **Mobile-only**: No layouts desktop, solo 320-428px
2. **Idioma español**: UI, BD, código en español
3. **Modelo People**: NO usar `User`, usar `People` + OTP
4. **CORS**: Siempre `/api/*` en frontend (proxy Next.js)
5. **CSRF**: `getCsrfCookie()` antes de requests autenticados

## Instrucciones para Claude: Uso Automático de Gemini CLI

**Claude DEBE usar Gemini CLI automáticamente** (vía Bash) en estos casos:

1. **Análisis multi-archivo**: Cuando necesites entender >3 archivos relacionados
2. **Búsqueda de patrones**: Encontrar todos los usos de una función/modelo/variable
3. **Arquitectura**: Entender estructura de directorios o relaciones entre módulos
4. **Migraciones/Schema**: Analizar estructura de base de datos completa

**Cómo usar** (ejemplos para Claude):
```bash
# Analizar controladores
gemini "analiza app/Http/Controllers/* y resume cada controlador en 1 línea"

# Buscar usos de modelo
gemini "encuentra todas las referencias a People en backend/"

# Revisar relaciones de BD
gemini "lista tablas y relaciones de database/migrations/*"
```

**Workflow de Claude**:
1. User pide cambio complejo → Claude identifica si necesita contexto amplio
2. Claude ejecuta Gemini CLI con Bash tool automáticamente
3. Claude analiza output de Gemini (no se muestra al user)
4. Claude implementa basándose en ese contexto
5. User solo ve resultado final

**Beneficio**: Gemini no consume tokens de Claude. Usar para lectura masiva, Claude para implementación.
