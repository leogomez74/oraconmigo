<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BibliaController;
use App\Http\Controllers\OracionController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegistrationController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

// OTP Authentication (TODO: Implement logic)
Route::post('/otp/send', [\App\Http\Controllers\OtpController::class, 'send']);
Route::post('/otp/verify', [\App\Http\Controllers\OtpController::class, 'verify']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Encuesta routes
    Route::get('/encuestas', [\App\Http\Controllers\EncuestaController::class, 'index']);
    Route::post('/encuestas', [\App\Http\Controllers\EncuestaController::class, 'store']);

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
