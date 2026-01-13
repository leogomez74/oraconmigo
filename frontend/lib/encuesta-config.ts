/**
 * Configuración de la encuesta
 * Debe coincidir con backend/config/encuesta.php
 */

export const ENCUESTA_CONFIG = {
  // Estructura
  TOTAL_PASOS: 7,
  PREGUNTAS_POR_PASO: 2,
  TOTAL_PREGUNTAS: 14,

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
  // Basadas en el onboarding completo de Pray.com (14 preguntas)
  PREGUNTAS_IDS: [
    // Paso 1 (14%)
    'tiempo_diario',
    'momento_preferido',
    // Paso 2 (28%)
    'area_mejorar',
    'nivel_estres',
    // Paso 3 (42%)
    'experiencia_oracion',
    'temas_oracion',
    // Paso 4 (57%)
    'sistema_apoyo',
    'genero',
    // Paso 5 (71%)
    'grupo_edad',
    'formato_preferido',
    // Paso 6 (85%)
    'recordatorios',
    'frecuencia_recordatorios',
    // Paso 7 (100%)
    'funcionalidades_deseadas',
    'experiencia_premium',
  ] as const,

  // Definición de pasos
  PASOS: {
    1: {
      nombre: 'Compromiso inicial',
      porcentaje: 14,
      preguntas: ['tiempo_diario', 'momento_preferido'],
    },
    2: {
      nombre: 'Necesidades emocionales',
      porcentaje: 28,
      preguntas: ['area_mejorar', 'nivel_estres'],
    },
    3: {
      nombre: 'Experiencia espiritual',
      porcentaje: 42,
      preguntas: ['experiencia_oracion', 'temas_oracion'],
    },
    4: {
      nombre: 'Sistema de apoyo',
      porcentaje: 57,
      preguntas: ['sistema_apoyo', 'genero'],
    },
    5: {
      nombre: 'Perfil personal',
      porcentaje: 71,
      preguntas: ['grupo_edad', 'formato_preferido'],
    },
    6: {
      nombre: 'Hábitos y recordatorios',
      porcentaje: 85,
      preguntas: ['recordatorios', 'frecuencia_recordatorios'],
    },
    7: {
      nombre: 'Características',
      porcentaje: 100,
      preguntas: ['funcionalidades_deseadas', 'experiencia_premium'],
    },
  } as const,
} as const;

export type EstadoEncuesta = typeof ENCUESTA_CONFIG.ESTADOS[keyof typeof ENCUESTA_CONFIG.ESTADOS];
export type PreguntaId = typeof ENCUESTA_CONFIG.PREGUNTAS_IDS[number];
