# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 application with an Inertia.js + React frontend stack. The application uses:
- **Backend**: PHP 8.2+ with Laravel 12
- **Frontend**: React 19 with Inertia.js for SPA-like experience without building an API
- **Styling**: Tailwind CSS v4
- **Build**: Vite for asset bundling
- **Database**: SQLite (default, configurable)
- **Testing**: PHPUnit for backend tests

## Development Commands

### Initial Setup
```bash
composer setup
```
This runs: composer install, creates .env from .env.example, generates app key, runs migrations, installs npm packages, and builds assets.

### Development Mode
```bash
composer dev
```
This concurrently runs:
- PHP development server (`php artisan serve`)
- Queue worker (`php artisan queue:listen`)
- Log viewer (`php artisan pail`)
- Vite dev server with HMR (`npm run dev`)

Alternatively, run components separately:
```bash
php artisan serve       # Start development server (http://localhost:8000)
npm run dev             # Start Vite dev server with hot module replacement
php artisan queue:listen # Run queue worker
php artisan pail        # View logs in real-time
```

### Testing
```bash
composer test           # Run all PHPUnit tests
php artisan test        # Alternative test command
php artisan test --filter=TestName  # Run specific test
```

Tests use in-memory SQLite database and are configured in `phpunit.xml`.

### Building Assets
```bash
npm run build           # Build production assets with Vite
```

### Code Quality
```bash
./vendor/bin/pint       # Format PHP code (Laravel Pint)
```

### Database
```bash
php artisan migrate              # Run migrations
php artisan migrate:fresh --seed # Fresh database with seeders
php artisan db:seed              # Run seeders only
```

### Other Useful Commands
```bash
php artisan tinker      # Interactive REPL
php artisan route:list  # List all routes
php artisan make:model ModelName -mfc  # Create model with migration, factory, controller
php artisan make:controller ControllerName  # Create controller
```

## Architecture

### Backend Structure

**Routes**: Defined in `routes/web.php` using Inertia::render() to return React components instead of Blade views.

**Controllers**: Located in `app/Http/Controllers/`. The base Controller class extends Laravel's base controller.

**Models**: Located in `app/Models/`. Uses Eloquent ORM. Default User model is provided.

**Middleware**: Custom middleware in `app/Http/Middleware/`. The `HandleInertiaRequests` middleware:
- Sets the root view to `resources/views/app.blade.php`
- Shares data globally to all Inertia pages via the `share()` method

**Service Providers**: Located in `app/Providers/`. `AppServiceProvider` is the main service provider for bootstrapping.

**Application Bootstrap**: `bootstrap/app.php` configures:
- Web routes from `routes/web.php`
- Console routes from `routes/console.php`
- Health check endpoint at `/up`
- Middleware stack (includes HandleInertiaRequests for web routes)

### Frontend Structure

**Entry Point**: `resources/js/app.jsx` initializes the Inertia app:
- Configures automatic page component resolution from `./Pages/**/*.jsx`
- Sets up React root rendering
- Configures progress bar color

**Pages**: React components in `resources/js/Pages/` are rendered by Inertia routes. Each page component receives props from the backend controller/route.

**Components**: Shared React components in `resources/js/Components/`. The `Layout.jsx` component provides common layout structure.

**Root Template**: `resources/views/app.blade.php` is the single HTML template that loads the React app.

**Styling**: CSS in `resources/css/app.css` with Tailwind directives. Tailwind configured in `tailwind.config.js`.

### Inertia.js Integration

Inertia creates a bridge between Laravel and React:
- Backend routes use `Inertia::render('ComponentName', $props)` instead of returning views
- No API needed - props are passed directly from controllers to React components
- Client-side routing with server-side routing fallback
- Shared data from `HandleInertiaRequests::share()` is available to all pages

### Build Configuration

**Vite** (`vite.config.js`):
- Entry points: `resources/css/app.css` and `resources/js/app.jsx`
- Laravel Vite plugin handles asset versioning and hot reload
- React plugin for JSX transformation
- Ignores `storage/framework/views/` for better performance

### Database

Migrations in `database/migrations/` follow Laravel's timestamp-based naming. Default tables:
- `users` - User authentication
- `cache` - Cache storage
- `jobs` - Queue jobs

Factories in `database/factories/` for test data generation.
Seeders in `database/seeders/` for populating database.

## Key Patterns

### Adding a New Page

1. Create route in `routes/web.php`:
```php
Route::get('/example', function () {
    return Inertia::render('Example', ['data' => 'value']);
});
```

2. Create React component in `resources/js/Pages/Example.jsx`:
```jsx
export default function Example({ data }) {
    return <div>{data}</div>;
}
```

### Sharing Data Globally

Modify `app/Http/Middleware/HandleInertiaRequests.php`:
```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
    ]);
}
```

### Creating Controllers with Inertia

```php
use Inertia\Inertia;

class ExampleController extends Controller
{
    public function index()
    {
        return Inertia::render('Example/Index', [
            'items' => Item::all(),
        ]);
    }
}
```
