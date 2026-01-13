/**
 * Configuración de la encuesta
 * Debe coincidir con backend/config/encuesta.php
 */

export const ENCUESTA_CONFIG = {
  // Estructura
  TOTAL_PASOS: 4,
  PREGUNTAS_POR_PASO: 2,
  TOTAL_PREGUNTAS: 8,

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
  // Basadas en el onboarding de Pray.com
  PREGUNTAS_IDS: [
    // Paso 1 (25%)
    'tiempo_diario',
    'area_mejorar',
    // Paso 2 (50%)
    'sistema_apoyo',
    'genero',
    // Paso 3 (75%)
    'grupo_edad',
    'recordatorios',
    // Paso 4 (100%)
    'funcionalidades_deseadas',
    'experiencia_premium',
  ] as const,

  // Definición de pasos
  PASOS: {
    1: {
      nombre: 'Compromiso inicial',
      porcentaje: 25,
      preguntas: ['tiempo_diario', 'area_mejorar'],
    },
    2: {
      nombre: 'Perfil personal',
      porcentaje: 50,
      preguntas: ['sistema_apoyo', 'genero'],
    },
    3: {
      nombre: 'Preferencias',
      porcentaje: 75,
      preguntas: ['grupo_edad', 'recordatorios'],
    },
    4: {
      nombre: 'Características',
      porcentaje: 100,
      preguntas: ['funcionalidades_deseadas', 'experiencia_premium'],
    },
  } as const,
} as const;

export type EstadoEncuesta = typeof ENCUESTA_CONFIG.ESTADOS[keyof typeof ENCUESTA_CONFIG.ESTADOS];
export type PreguntaId = typeof ENCUESTA_CONFIG.PREGUNTAS_IDS[number];
