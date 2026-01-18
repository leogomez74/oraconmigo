<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\EncuestaController;
use App\Http\Controllers\RespuestaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view('welcome');
});

// Login page for admin (Inertia.js)
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

// Admin login (solo email, sin OTP) - Public route
Route::post('/admin/login', [AuthController::class, 'adminLogin'])->name('admin.login');

// Public routes
Route::post('/register', [RegistrationController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes with Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Encuesta routes
    Route::get('/encuestas', [EncuestaController::class, 'index']);
    Route::post('/encuestas', [EncuestaController::class, 'store']);

    // Respuesta routes
    Route::post('/respuestas', [RespuestaController::class, 'store']);
});

// Admin routes - Protected with admin middleware
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    })->name('home');

    Route::post('/logout', [AuthController::class, 'adminLogout'])->name('logout');

    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/funnel', [AdminController::class, 'funnel'])->name('funnel');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::post('/users', [AdminController::class, 'store'])->name('users.store');
    Route::put('/users/{whatsapp}', [AdminController::class, 'update'])->name('users.update');
    Route::delete('/users/{whatsapp}', [AdminController::class, 'destroy'])->name('users.destroy');
    Route::get('/content', [AdminController::class, 'content'])->name('content');
    Route::get('/encuesta-analytics', [AdminController::class, 'encuestaAnalytics'])->name('encuesta.analytics');
});
