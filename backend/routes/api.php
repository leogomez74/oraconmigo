<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BibliaController;
use App\Http\Controllers\OracionController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EncuestaController;

Route::post('/register', [RegistrationController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/condiciones',[RegistrationController::class, 'condiciones']);

// OTP Authentication (TODO: Implement logic)

// Protected routes

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Encuesta routes
    Route::get('/encuestas', [EncuestaController::class, 'index']);
    Route::post('/encuestas', [EncuestaController::class, 'store']);

    // Encuesta progreso routes (tracking de abandono)
    Route::post('/encuesta/progreso', [EncuestaController::class, 'guardarProgreso']);
    Route::get('/encuesta/progreso', [EncuestaController::class, 'obtenerProgreso']);

    // Respuesta routes
    Route::post('/respuestas', [\App\Http\Controllers\RespuestaController::class, 'store']);

    // Biblia routes
    Route::post('/biblia/registrar', [BibliaController::class, 'registrar']);

    // Oraciones routes
    Route::get('/oraciones', [OracionController::class, 'index']);
    Route::get('/oraciones/categorias', [OracionController::class, 'categorias']);
    Route::get('/oraciones/recomendadas', [OracionController::class, 'recomendadas']);
    Route::get('/oraciones/{id}', [OracionController::class, 'show']);
    Route::post('/oraciones/{id}/completar', [OracionController::class, 'completar']);
    Route::post('/oraciones/{id}/progreso', [OracionController::class, 'actualizarProgreso']);
});
