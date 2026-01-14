/**
 * Configuración de la encuesta
 * Debe coincidir con backend/config/encuesta.php
 */

export const ENCUESTA_CONFIG = {
  // Estructura
  TOTAL_PASOS: 21,
  PREGUNTAS_POR_PASO: 1,
  TOTAL_PREGUNTAS: 21,

  // Auto-save timing (3 segundos - estándar industria)
  AUTOSAVE_DELAY_MS: 3000,

  // Estados posibles
  ESTADOS: {
    SIN_INICIAR: 'sin_iniciar',
    EN_PROGRESO: 'en_progreso',
    COMPLETADA: 'completada',
    ABANDONADA: 'abandonada',
  } as const,

  // IDs de preguntas (deben coincidir con el array questions en page.tsx)
  // Basadas en el onboarding completo de Pray.com + preguntas adicionales (20 preguntas)
  PREGUNTAS_IDS: [
    'tiempo_diario',           // Paso 1 (5%)
    'momento_preferido',       // Paso 2 (10%)
    'area_mejorar',           // Paso 3 (15%)
    'nivel_estres',           // Paso 4 (20%)
    'experiencia_oracion',    // Paso 5 (25%)
    'temas_oracion',          // Paso 6 (30%)
    'denominacion',           // Paso 7 (35%)
    'asistencia_iglesia',     // Paso 8 (40%)
    'lectura_biblia',         // Paso 9 (45%)
    'conocimiento_biblico',   // Paso 10 (50%)
    'sistema_apoyo',          // Paso 11 (55%)
    'estado_civil',           // Paso 12 (60%)
    'tiene_hijos',            // Paso 13 (65%)
    'genero',                 // Paso 14 (70%)
    'grupo_edad',             // Paso 15 (75%)
    'formato_preferido',      // Paso 16 (80%)
    'recordatorios',          // Paso 17 (85%)
    'frecuencia_recordatorios', // Paso 18 (90%)
    'funcionalidades_deseadas', // Paso 19 (95%)
    'experiencia_premium',    // Paso 20 (100%)
    'interes_donacion',       // Paso 21 (100%)
  ] as const,

  // Definición de pasos (21 pasos individuales)
  PASOS: {
    1: { nombre: 'Tiempo de oración', porcentaje: 5, preguntas: ['tiempo_diario'] },
    2: { nombre: 'Momento del día', porcentaje: 10, preguntas: ['momento_preferido'] },
    3: { nombre: 'Áreas a mejorar', porcentaje: 14, preguntas: ['area_mejorar'] },
    4: { nombre: 'Nivel de estrés', porcentaje: 19, preguntas: ['nivel_estres'] },
    5: { nombre: 'Experiencia con oración', porcentaje: 24, preguntas: ['experiencia_oracion'] },
    6: { nombre: 'Temas de oración', porcentaje: 29, preguntas: ['temas_oracion'] },
    7: { nombre: 'Denominación', porcentaje: 33, preguntas: ['denominacion'] },
    8: { nombre: 'Asistencia a iglesia', porcentaje: 38, preguntas: ['asistencia_iglesia'] },
    9: { nombre: 'Lectura bíblica', porcentaje: 43, preguntas: ['lectura_biblia'] },
    10: { nombre: 'Conocimiento bíblico', porcentaje: 48, preguntas: ['conocimiento_biblico'] },
    11: { nombre: 'Sistema de apoyo', porcentaje: 52, preguntas: ['sistema_apoyo'] },
    12: { nombre: 'Estado civil', porcentaje: 57, preguntas: ['estado_civil'] },
    13: { nombre: 'Hijos', porcentaje: 62, preguntas: ['tiene_hijos'] },
    14: { nombre: 'Género', porcentaje: 67, preguntas: ['genero'] },
    15: { nombre: 'Edad', porcentaje: 71, preguntas: ['grupo_edad'] },
    16: { nombre: 'Formato de contenido', porcentaje: 76, preguntas: ['formato_preferido'] },
    17: { nombre: 'Recordatorios', porcentaje: 81, preguntas: ['recordatorios'] },
    18: { nombre: 'Frecuencia', porcentaje: 86, preguntas: ['frecuencia_recordatorios'] },
    19: { nombre: 'Funcionalidades', porcentaje: 90, preguntas: ['funcionalidades_deseadas'] },
    20: { nombre: 'Premium', porcentaje: 95, preguntas: ['experiencia_premium'] },
    21: { nombre: 'Donación', porcentaje: 100, preguntas: ['interes_donacion'] },
  } as const,
} as const;

export type EstadoEncuesta = typeof ENCUESTA_CONFIG.ESTADOS[keyof typeof ENCUESTA_CONFIG.ESTADOS];
export type PreguntaId = typeof ENCUESTA_CONFIG.PREGUNTAS_IDS[number];
