<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuración de Encuesta
    |--------------------------------------------------------------------------
    |
    | Configuración para el sistema de tracking de progreso de encuesta.
    | Este archivo debe mantenerse en sincronía con frontend/lib/encuesta-config.ts
    |
    */

    // Estructura de la encuesta
    'total_pasos' => 21,
    'preguntas_por_paso' => 1,
    'total_preguntas' => 21,

    // Auto-save timing (en milisegundos)
    'autosave_delay_ms' => 3000,

    // Estados posibles
    'estados' => [
        'sin_iniciar' => 'sin_iniciar',
        'en_progreso' => 'en_progreso',
        'completada' => 'completada',
        'abandonada' => 'abandonada',
    ],

    // IDs de preguntas
    'preguntas_ids' => [
        'tiempo_diario',
        'momento_preferido',
        'area_mejorar',
        'nivel_estres',
        'experiencia_oracion',
        'temas_oracion',
        'denominacion',
        'asistencia_iglesia',
        'lectura_biblia',
        'conocimiento_biblico',
        'sistema_apoyo',
        'estado_civil',
        'tiene_hijos',
        'genero',
        'grupo_edad',
        'formato_preferido',
        'recordatorios',
        'frecuencia_recordatorios',
        'funcionalidades_deseadas',
        'experiencia_premium',
        'interes_donacion',
    ],

    // Definición de pasos
    'pasos' => [
        1 => ['nombre' => 'Tiempo de oración', 'porcentaje' => 5, 'preguntas' => ['tiempo_diario']],
        2 => ['nombre' => 'Momento del día', 'porcentaje' => 10, 'preguntas' => ['momento_preferido']],
        3 => ['nombre' => 'Áreas a mejorar', 'porcentaje' => 14, 'preguntas' => ['area_mejorar']],
        4 => ['nombre' => 'Nivel de estrés', 'porcentaje' => 19, 'preguntas' => ['nivel_estres']],
        5 => ['nombre' => 'Experiencia con oración', 'porcentaje' => 24, 'preguntas' => ['experiencia_oracion']],
        6 => ['nombre' => 'Temas de oración', 'porcentaje' => 29, 'preguntas' => ['temas_oracion']],
        7 => ['nombre' => 'Denominación', 'porcentaje' => 33, 'preguntas' => ['denominacion']],
        8 => ['nombre' => 'Asistencia a iglesia', 'porcentaje' => 38, 'preguntas' => ['asistencia_iglesia']],
        9 => ['nombre' => 'Lectura bíblica', 'porcentaje' => 43, 'preguntas' => ['lectura_biblia']],
        10 => ['nombre' => 'Conocimiento bíblico', 'porcentaje' => 48, 'preguntas' => ['conocimiento_biblico']],
        11 => ['nombre' => 'Sistema de apoyo', 'porcentaje' => 52, 'preguntas' => ['sistema_apoyo']],
        12 => ['nombre' => 'Estado civil', 'porcentaje' => 57, 'preguntas' => ['estado_civil']],
        13 => ['nombre' => 'Hijos', 'porcentaje' => 62, 'preguntas' => ['tiene_hijos']],
        14 => ['nombre' => 'Género', 'porcentaje' => 67, 'preguntas' => ['genero']],
        15 => ['nombre' => 'Edad', 'porcentaje' => 71, 'preguntas' => ['grupo_edad']],
        16 => ['nombre' => 'Formato de contenido', 'porcentaje' => 76, 'preguntas' => ['formato_preferido']],
        17 => ['nombre' => 'Recordatorios', 'porcentaje' => 81, 'preguntas' => ['recordatorios']],
        18 => ['nombre' => 'Frecuencia', 'porcentaje' => 86, 'preguntas' => ['frecuencia_recordatorios']],
        19 => ['nombre' => 'Funcionalidades', 'porcentaje' => 90, 'preguntas' => ['funcionalidades_deseadas']],
        20 => ['nombre' => 'Premium', 'porcentaje' => 95, 'preguntas' => ['experiencia_premium']],
        21 => ['nombre' => 'Donación', 'porcentaje' => 100, 'preguntas' => ['interes_donacion']],
    ],
];