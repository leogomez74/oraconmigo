# Proyecto Ora

Una aplicación web full-stack construida con Laravel (Backend) y Next.js (Frontend).

## Tecnologías

- **Backend:** Laravel 12.x
- **Frontend:** Next.js 16.x (React 19)
- **Base de Datos:** SQLite (predeterminado) / MySQL
- **Estilos:** Tailwind CSS

## Requisitos Previos

- PHP >= 8.2
- Composer
- Node.js >= 20
- NPM

## Instalación

1.  **Clonar el repositorio** (si aún no lo has hecho).

2.  **Configuración del Backend:**
    Navega al directorio `backend`:
    ```bash
    cd backend
    ```
    Instala las dependencias de PHP:
    ```bash
    composer install
    ```
    Configura el entorno y la base de datos:
    ```bash
    composer setup
    ```
    (Este script copia el archivo `.env`, genera la clave y ejecuta las migraciones).

3.  **Configuración del Frontend:**
    Navega al directorio `frontend`:
    ```bash
    cd ../frontend
    ```
    Instala las dependencias de Node:
    ```bash
    npm install
    ```

## Ejecución de la Aplicación

Desde el directorio `backend`, puedes iniciar todo el stack (API Backend, Worker de Colas y Frontend) con un solo comando:

```bash
composer dev
```

Este comando utiliza `concurrently` para ejecutar:
- Servidor Laravel (`http://localhost:8000`)
- Listener de Colas de Laravel
- Servidor de Desarrollo Next.js (`http://localhost:3000`)

## Estructura del Proyecto

- `backend/`: Aplicación Laravel (API, Autenticación, Lógica de Negocio).
- `frontend/`: Aplicación Next.js (UI, Páginas, Componentes).

## Características

- **Autenticación:** Autenticación basada en Sanctum.
- **Registro:**
    - Registro de usuarios con selección dinámica de país.
    - Detección automática del prefijo telefónico basado en el país.
    - Validación de número de WhatsApp (8-15 dígitos).
- **Encuestas:** (En progreso)

## Actualizaciones Recientes

- **Flujo de Registro:** UI mejorada para la entrada del número de teléfono con campos divididos para prefijo/número y sincronización automática del prefijo.
- **Entorno de Desarrollo:** Se corrigió `composer dev` para manejar correctamente el directorio hermano `frontend`.
