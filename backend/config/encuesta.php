<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuración de Encuesta
    |--------------------------------------------------------------------------
    |
    | Configuración para el sistema de tracking de progreso de encuesta
    |
    */

    // Estructura de la encuesta
    'total_pasos' => 4,
    'preguntas_por_paso' => 2,
    'total_preguntas' => 8,

    // Auto-save timing (en milisegundos)
    'autosave_delay_ms' => 3000, // 3 segundos (estándar industria)

    // Estados posibles
    'estados' => [
        'sin_iniciar' => 'sin_iniciar',
        'en_progreso' => 'en_progreso',
        'completada' => 'completada',
        'abandonada' => 'abandonada',
    ],

    // IDs de preguntas (deben coincidir con frontend)
    'preguntas' => [
        // Paso 1 (25%)
        'vida_oracion',
        'frecuencia_oracion',
        // Paso 2 (50%)
        'temas_oracion',
        'momento_oracion',
        // Paso 3 (75%)
        'comodidad_ia',
        'expectativas_servicio',
        // Paso 4 (100%)
        'funcionalidades_deseadas',
        'aspecto_importante',
    ],

    // Definición de pasos para analytics
    'pasos' => [
        1 => [
            'nombre' => 'Vida de oración',
            'porcentaje' => 25,
            'preguntas' => ['vida_oracion', 'frecuencia_oracion'],
        ],
        2 => [
            'nombre' => 'Necesidades espirituales',
            'porcentaje' => 50,
            'preguntas' => ['temas_oracion', 'momento_oracion'],
        ],
        3 => [
            'nombre' => 'Servicio con IA',
            'porcentaje' => 75,
            'preguntas' => ['comodidad_ia', 'expectativas_servicio'],
        ],
        4 => [
            'nombre' => 'Características deseadas',
            'porcentaje' => 100,
            'preguntas' => ['funcionalidades_deseadas', 'aspecto_importante'],
        ],
    ],
];
