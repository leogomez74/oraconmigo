# Plan MVP - Oras App

**Última actualización**: 2026-01-09

## 🎉 Últimos Cambios (09/01/2026)

### ✅ Completado: Sistema de Oraciones Guiadas
- Backend completo con modelos, controladores, 6 endpoints API
- Frontend con lista de oraciones, detalle, filtros por categoría
- 10 oraciones seeded (5 gratuitas, 5 premium)
- Tracking de progreso y completado por usuario
- UI mobile optimizada con badges premium/completado
- Reproductor de audio HTML5 básico implementado
- Fix CORS: Configuración correcta de proxy Next.js

**Progreso MVP: 48% → 68% completado** 📈

---

## Visión del MVP

Aplicación móvil de oración guiada con acceso gratuito a la Biblia RVR1960 y monetización básica.

---

## Estado Actual del Proyecto

### ✅ COMPLETADO (Estimado: 68%)

#### 1. Infraestructura Base
- [x] Monorepo configurado (Backend Laravel + Frontend Next.js)
- [x] Base de datos SQLite con migraciones
- [x] Autenticación con Laravel Sanctum
- [x] Sistema OTP por email (envío y verificación)
- [x] API REST funcional con CORS configurado
- [x] Diseño mobile-only optimizado
- [x] Backend Inertia.js + React configurado (base para dashboard admin)

#### 2. Autenticación y Usuarios
- [x] Registro de usuarios con validación
- [x] Selección de país con prefijos telefónicos automáticos
- [x] Campo WhatsApp opcional
- [x] Login con OTP (2 pasos: email → código)
- [x] Logout funcional
- [x] Verificación de autenticación en rutas protegidas
- [x] Modelo `People` como usuario principal

#### 3. Biblia Gratuita
- [x] Lector de Biblia RVR1960 completo
- [x] Navegación por libros del Antiguo y Nuevo Testamento
- [x] Navegación por capítulos
- [x] Lectura de versículos con numeración
- [x] Navegación siguiente/anterior capítulo
- [x] Integración con API externa (bible-api.deno.dev)
- [x] UI mobile optimizada para lectura
- [x] Requiere autenticación (login obligatorio para acceder)
- [x] Tracking automático de lecturas (backend registra capítulos leídos)

#### 4. Dashboard
- [x] Página principal del usuario autenticado
- [x] Saludo personalizado según hora del día
- [x] Componente "Palabra del día" (DailyVerse)
- [x] Estadísticas básicas (racha, oraciones)
- [x] Acceso rápido a la Biblia
- [x] Botón de logout

#### 5. Sistema de Encuestas
- [x] Encuesta de onboarding (8 preguntas, 4 pasos)
- [x] Múltiples tipos de preguntas (textarea, radio, select, multiple choice)
- [x] Barra de progreso visual
- [x] Validación de campos requeridos
- [x] Almacenamiento de respuestas en BD
- [x] Redirección al dashboard al completar

#### 6. Dashboard Administrativo (Parcial)
**Backend:**
- [x] Campo `is_admin` agregado a tabla `people`
- [x] Middleware `IsAdmin` para proteger rutas administrativas
- [x] Controller `AdminController` con endpoints básicos:
  - [x] `GET /admin/dashboard` - Métricas generales
  - [x] `GET /admin/funnel` - Funnel de conversión
  - [x] `GET /admin/users` - Lista de usuarios con filtros
- [x] Modelo `BibleReading` para tracking de lecturas
- [x] Endpoint `POST /api/biblia/registrar` - Registra lectura de capítulo
- [x] Métricas implementadas:
  - [x] Usuarios totales, activos, por período (hoy, semana, mes)
  - [x] Encuestas completadas
  - [x] Usuarios leyendo Biblia (tracking de engagement)
  - [x] Total de lecturas de Biblia
  - [x] Lecturas de Biblia por semana
  - [x] Top 5 libros más leídos

**Frontend (Inertia.js):**
- [x] Ruta `/admin` protegida con middleware admin
- [x] Página `/admin/login` - Login simple con email (sin OTP para admins)
- [x] Página `/admin/dashboard` - Overview con KPIs principales
- [x] Página `/admin/funnel` - Visualización del funnel de conversión
- [x] Página `/admin/users` - Tabla de usuarios con:
  - [x] Búsqueda por nombre/email
  - [x] Filtros (admin, premium, activos)
  - [x] CRUD completo (crear, editar, eliminar usuarios)
  - [x] Paginación (20 usuarios por página)
- [x] Sección de métricas de Biblia con:
  - [x] Porcentaje de usuarios leyendo
  - [x] Total de capítulos leídos
  - [x] Lecturas de la semana
  - [x] Ranking de libros más populares

**Seguridad:**
- [x] Verificación de rol admin en middleware
- [x] CSRF protection (excepto en /admin/login)
- [x] Autenticación con sesiones Laravel

#### 7. Core: Oración Guiada 🎯
**Backend:**
- [x] Modelo `Oracion` con campos: titulo, categoria, descripcion, contenido_texto, audio_url, duracion, es_premium, orden
- [x] Modelo `OracionUsuario` con pivot table y tracking de progreso/completado
- [x] Controller `OracionController` con 6 endpoints:
  - [x] `GET /api/oraciones` - Lista con filtros (categoría, tipo premium/gratuitas)
  - [x] `GET /api/oraciones/{id}` - Detalle de oración con progreso del usuario
  - [x] `POST /api/oraciones/{id}/completar` - Marcar como completada (100% progreso)
  - [x] `POST /api/oraciones/{id}/progreso` - Actualizar progreso (0-100)
  - [x] `GET /api/oraciones/recomendadas` - Oraciones recomendadas (top 5 gratuitas)
  - [x] `GET /api/oraciones/categorias` - Lista de categorías disponibles
- [x] Migraciones para tablas `oraciones` y `oracion_usuario`
- [x] Seeder con 10 oraciones (5 gratuitas, 5 premium)
- [x] Relación many-to-many entre People y Oracion
- [x] Scopes en modelo: gratuitas(), premium(), categoria(), ordenado()

**Frontend:**
- [x] Página `/oracion` - Lista de oraciones con filtros por categoría
- [x] Página `/oracion/[id]` - Vista detallada con texto completo
- [x] Botón "Marcar como completada" con estado de carga
- [x] Indicadores visuales: completada (checkmark verde), premium (badge dorado)
- [x] Filtros de categoría con pills interactivos
- [x] Muestra duración estimada de cada oración
- [x] Progreso del usuario en cada oración
- [x] Mensaje de confirmación al completar
- [x] Integración completa con API backend (CSRF + auth)
- [x] Reproductor de audio HTML5 básico (para oraciones con audio_url)

**Contenido:**
- [x] 10 oraciones seeded (5 gratuitas: Padre Nuestro, Mañana, Gratitud, Paz Interior, Noche)
- [x] 5 oraciones premium: Sanación, Fortaleza, Sabiduría, Familia, Protección
- [x] Categorías: Tradicional, Mañana, Noche, Gratitud, Paz, Sanación, Fortaleza, Sabiduría, Familia
- [ ] Grabar audios profesionales para oraciones premium (TTS o voz humana)
- [ ] Subir archivos de audio a storage (S3, Cloudinary, o local)
- [ ] Expandir a 15-20 oraciones de calidad

**Integración con Dashboard:**
- [x] Botón "Oraciones Guiadas" agregado en dashboard principal
- [x] Acceso directo desde página de usuario autenticado

**Correcciones Técnicas:**
- [x] Fix CORS: Configurado API_URL como string vacío para usar proxy Next.js
- [x] Todos los endpoints frontend usan prefijo `/api/*` o `/sanctum/*`
- [x] Proxy Next.js configurado en next.config.ts

---

### ❌ PENDIENTE (Estimado: 32%)

#### 8. Monetización Básica (PRIORITARIO) 🎯
**Backend:**
- [ ] Modelo `Suscripcion` (user_id, plan, estado, inicio, fin, metodo_pago)
- [ ] Modelo `Plan` o enum con planes: FREE, PREMIUM_MENSUAL, PREMIUM_ANUAL
- [ ] Middleware `CheckSubscription` para rutas premium
- [ ] Controller `SuscripcionController`:
  - [ ] `GET /api/planes` - Lista de planes disponibles
  - [ ] `POST /api/suscripcion/crear` - Crear suscripción
  - [ ] `POST /api/suscripcion/cancelar` - Cancelar suscripción
  - [ ] `GET /api/suscripcion/estado` - Estado actual de suscripción
- [ ] Integración con Stripe o MercadoPago (webhook de pago)
- [ ] Migración para tabla `suscripciones`

**Frontend:**
- [ ] Página `/planes` - Showcase de planes (Gratis vs Premium)
- [ ] Modal de upgrade cuando intenta acceder a contenido premium
- [ ] Página `/checkout` - Proceso de pago con Stripe/MercadoPago
- [ ] Badge "Premium" en perfil de usuario
- [ ] Indicadores visuales de contenido premium (candado dorado)

**Configuración:**
- [ ] Configurar cuenta Stripe o MercadoPago
- [ ] Definir precios (ej: $4.99/mes, $39.99/año)
- [ ] Configurar webhooks de pago
- [ ] Política de cancelación y reembolsos

#### 9. Dashboard Admin - Métricas Avanzadas
**Backend:**
- [ ] Endpoints adicionales:
  - [ ] `GET /api/admin/revenue` - Métricas de ingresos (MRR, ARR)
  - [ ] `GET /api/admin/oraciones/stats` - Analytics de oraciones (completadas, por categoría, más populares)
- [ ] Queries agregadas para métricas financieras:
  - [ ] Suscripciones activas/canceladas
  - [ ] Churn rate
  - [ ] MRR (Monthly Recurring Revenue)
  - [ ] LTV (Lifetime Value)
- [ ] Queries para analytics de oraciones:
  - [ ] Total oraciones completadas por usuario
  - [ ] Oraciones más populares
  - [ ] Distribución por categoría
  - [ ] Tiempo promedio de completado
  - [ ] Tasa de completado de oraciones iniciadas

**Frontend:**
- [ ] Página `/admin/revenue` - Métricas financieras (MRR, ARR, churn)
- [ ] Página `/admin/content` - Analytics de oraciones y contenido
- [ ] Componentes de gráficos interactivos (usar Chart.js o Recharts)
- [ ] Export de datos a CSV
- [ ] Rate limiting en endpoints admin
- [ ] Logging de acciones administrativas

#### 10. Intenciones de Oración
- [ ] Modelo `Intencion` (user_id, titulo, descripcion, categoria, estado, creada_at)
- [ ] Controller `IntencionController` (CRUD de intenciones)
- [ ] Página `/intenciones` - Lista de mis intenciones
- [ ] Página `/intenciones/nueva` - Crear intención
- [ ] Opción de marcar intención como "respondida"
- [ ] Estadísticas de intenciones respondidas en dashboard

#### 11. Historial y Estadísticas
- [ ] Modelo `ActividadUsuario` (user_id, tipo, metadata, fecha)
- [ ] Registro de actividades: oración completada, capítulo leído, etc.
- [ ] Cálculo de racha de días consecutivos
- [ ] Página `/estadisticas` con gráficos simples
- [ ] Implementar contadores reales en dashboard (actualmente hardcoded)

#### 12. Notificaciones y Recordatorios
- [ ] Recordatorio diario para orar (según hora preferida de encuesta)
- [ ] Notificaciones push (usando OneSignal o similar)
- [ ] Configuración de notificaciones en perfil de usuario

#### 13. Mejoras UX/UI
- [ ] Splash screen con logo
- [ ] Animaciones de transición entre páginas
- [ ] Skeleton loaders para carga de contenido
- [ ] Estados vacíos mejorados (empty states)
- [ ] Mensajes de error más amigables
- [ ] Tutorial de primera vez (onboarding visual)

#### 14. Optimizaciones Técnicas
- [ ] Caché de oraciones en frontend (IndexedDB o localStorage)
- [ ] Precarga de audio para mejor experiencia
- [ ] Optimización de imágenes (WebP)
- [ ] Service Worker para modo offline básico
- [ ] Analytics (Google Analytics o similar)
- [ ] Logging de errores (Sentry)

---

## Roadmap de Desarrollo

### ✅ Fase 1: Core de Oración (COMPLETADA) 🎉
**Objetivo:** Implementar funcionalidad principal de oración guiada

1. **Backend Oraciones** ✅
   - ✅ Modelos Oracion y OracionUsuario creados
   - ✅ OracionController con 6 endpoints implementados
   - ✅ 10 oraciones seeded (5 gratuitas, 5 premium)
   - ✅ Relación many-to-many con tracking de progreso

2. **Frontend Oraciones** ✅
   - ✅ Página /oracion con lista y filtros por categoría
   - ✅ Página /oracion/[id] con detalle completo
   - ✅ Botón completar con estados de carga
   - ✅ Reproductor de audio HTML5 básico
   - ✅ Integración completa con API (CSRF + auth)

3. **Pendiente de Fase 1:**
   - [ ] Grabar audios profesionales (5 oraciones premium)
   - [ ] Subir audios a storage
   - [ ] Expandir a 15-20 oraciones

### Fase 2: Monetización y Admin (Semana 3) 💰
**Objetivo:** Implementar sistema de suscripciones y dashboard administrativo

1. **Setup de Pagos** (2 días)
   - Configurar cuenta Stripe/MercadoPago
   - Crear planes de suscripción
   - Configurar webhooks

2. **Backend Suscripciones** (2 días)
   - Modelos y migraciones
   - Endpoints de suscripción
   - Middleware de verificación

3. **Frontend Monetización** (2 días)
   - Página de planes
   - Proceso de checkout
   - UI de contenido premium

4. **Dashboard Administrativo** (2-3 días)
   - Backend: Campo is_admin, middleware, endpoints de métricas
   - Frontend: Páginas /admin/dashboard y /admin/funnel
   - Métricas básicas: usuarios, conversiones, MRR
   - Gráficos del funnel de conversión

### Fase 3: Polish y Launch (Semana 4) 🚀
**Objetivo:** Pulir y preparar para lanzamiento

1. **Intenciones y Estadísticas** (2-3 días)
   - CRUD de intenciones
   - Estadísticas reales en dashboard
   - Cálculo de racha

2. **UX Final** (2 días)
   - Animaciones y transiciones
   - Splash screen
   - Tutorial de onboarding
   - Estados vacíos

3. **Testing y Deploy** (2 días)
   - Testing en dispositivos reales
   - Corrección de bugs
   - Deploy a producción
   - Analytics configurado

---

## Criterios de Éxito del MVP

**Funcionalidad de Usuario:**
- [x] Usuario puede registrarse e iniciar sesión con OTP
- [x] Usuario puede leer toda la Biblia RVR1960 gratis (requiere login)
- [x] Usuario puede acceder a 5 oraciones guiadas gratuitas (texto completo)
- [x] Usuario puede ver oraciones premium (con badge indicador)
- [x] Usuario puede completar oraciones y ver su progreso
- [x] Filtrado de oraciones por categoría funcional
- [x] Reproductor de audio HTML5 básico disponible (para oraciones con audio)
- [ ] Audios profesionales grabados para oraciones premium
- [ ] Usuario puede suscribirse a plan premium ($4.99/mes)
- [ ] Usuario puede crear y gestionar intenciones de oración
- [ ] Dashboard muestra estadísticas reales (racha, oraciones completadas)
- [x] App funciona perfectamente en móvil (responsive 320px-428px)
- [ ] Proceso de pago funciona end-to-end
- [ ] Contenido premium está bloqueado correctamente con paywall

**Dashboard Administrativo:**
- [x] Administrador puede acceder a /admin (protegido con is_admin)
- [x] Dashboard muestra métricas clave: usuarios totales, activos, conversiones
- [x] Visualización del funnel: Registro → Encuesta → Primera oración → Suscripción
- [x] Tabla de usuarios con filtros y búsqueda (búsqueda, CRUD completo)
- [x] Analytics de contenido de Biblia: usuarios leyendo, capítulos más leídos, lecturas por semana
- [ ] Métricas de ingresos: MRR, suscripciones activas, churn rate (pendiente hasta implementar monetización)
- [ ] Analytics de oraciones: más completadas, tasa de completado, categorías populares

---

## Métricas de Lanzamiento

**Técnicas:**
- Tiempo de carga < 3 segundos
- 0 errores críticos en producción
- Tasa de éxito de pago > 95%

**Negocio:**
- 100 usuarios registrados en primer mes
- Tasa de conversión gratuito → premium: 5%
- Retención día 7: >30%
- NPS (Net Promoter Score): >40

---

## Stack Tecnológico Actual

**Backend:**
- Laravel 12, PHP 8.2+
- SQLite (migrar a MySQL en producción)
- Laravel Sanctum (autenticación)
- Queue system para emails
- Inertia.js + React (para dashboard admin)
- **Modelos principales:** People, Oracion, OracionUsuario, BibleReading, Encuesta, Respuesta, OtpCode

**Frontend (App Móvil):**
- Next.js 16, React 19
- TypeScript
- Tailwind CSS v4
- Mobile-only design

**Frontend (Dashboard Admin):**
- Inertia.js + React 19
- Tailwind CSS v3
- Vite (build tool)

**Infraestructura:**
- Backend: localhost:8000 (producción: Laravel Forge, DigitalOcean, etc.)
- Frontend: localhost:3000 (producción: Vercel)
- Biblia API: bible-api.deno.dev
- Audio storage: TBD (S3, Cloudinary, local)
- Pagos: Stripe o MercadoPago

## Futuras Mejoras (Post-MVP)
- [ ] **Encapsular en Capacitor**: Convertir la aplicación web en una aplicación nativa para iOS y Android utilizando Capacitor para distribución en tiendas (App Store / Play Store).
- [ ] **Modo Offline avanzado**: Caché completa de audios y textos bíblicos para uso sin conexión.
- [ ] **Social**: 
sociales.

---

## Notas Importantes

1. **Dos Frontends Separados**:
   - **App móvil** (Next.js en `/frontend`) - Para usuarios finales, mobile-only
   - **Dashboard admin** (Inertia.js en `/backend/resources/js`) - Para administradores, monitoreo del funnel

2. **Contenido es Rey**: La calidad de las oraciones guiadas es crítica. Invertir tiempo en escribir contenido significativo y grabar audios profesionales.

3. **Mobile First**: La app de usuario debe funcionar perfectamente en móvil (320px-428px). No implementar versión desktop para la app móvil.

4. **Dashboard Admin vs App**: El dashboard administrativo puede ser responsive desktop (no tiene la restricción mobile-only), ya que será usado internamente por el equipo.

5. **Monetización Clara**: Diferenciación clara entre contenido gratuito y premium. 5 oraciones gratis para enganchar, resto es premium.

6. **Simplicidad**: MVP debe ser simple pero funcional. No agregar features complejas que retrasen el lanzamiento.

7. **Testing Real**: Probar en dispositivos reales (iOS y Android) antes de lanzar.

8. **Métricas desde el Día 1**: Implementar tracking de eventos importantes (registro, primera oración, conversión) desde el inicio para alimentar el dashboard admin.

---

## Siguiente Paso Inmediato

🎯 **ACCIÓN:** ~~Fase 1 completada~~ → Avanzar a Fase 2 - Implementar monetización básica

**Opciones de continuación:**

### Opción A: Mejorar contenido de oraciones (recomendado antes de monetizar)
- **Prioridad 1:** Grabar audios profesionales para las 5 oraciones premium (TTS o voz humana)
- **Prioridad 2:** Subir audios a storage (S3, Cloudinary, o local)
- **Prioridad 3:** Expandir de 10 a 15-20 oraciones de calidad
- **Beneficio:** Contenido robusto para justificar suscripción premium

### Opción B: Implementar sistema de suscripciones (monetización)
- **Prioridad 1:** Configurar cuenta Stripe/MercadoPago
- **Prioridad 2:** Backend: Modelos Suscripcion, endpoints, middleware
- **Prioridad 3:** Frontend: Página de planes, checkout, paywall para contenido premium
- **Beneficio:** Habilitar generación de ingresos desde MVP

### Opción C: Analytics de oraciones en Dashboard Admin
- **Prioridad 1:** Endpoint `GET /api/admin/oraciones/stats`
- **Prioridad 2:** Página `/admin/content` con métricas de oraciones
- **Prioridad 3:** Tracking de "Primera oración completada" para funnel
- **Beneficio:** Visibilidad de engagement con oraciones

**Recomendación:** Opción A → Opción B → Opción C (contenido primero, luego monetización, luego analytics)
