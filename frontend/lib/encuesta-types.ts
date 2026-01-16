import { EstadoEncuesta, PreguntaId } from './encuesta-config';

/**
 * Tipos TypeScript para el sistema de tracking de encuesta
 */

// Progreso del usuario en la encuesta
export interface EncuestaProgreso {
  id: number;
  people_id: number;
  paso_actual: number; // 1-4
  ultimo_paso_completado: number; // 0-4
  ultima_pregunta_vista: PreguntaId | null;
  preguntas_respondidas: PreguntaId[];
  respuestas_parciales: Record<string, any>;
  estado: EstadoEncuesta;
  completada: boolean;
  ultima_interaccion_at: string | null;
  created_at: string;
  updated_at: string;
}

// Payload para guardar progreso (POST /api/encuesta/progreso)
export interface GuardarProgresoPayload {
  encuesta_id?: number;
  paso_actual: number;
  ultimo_paso_completado: number;
  ultima_pregunta_vista: PreguntaId;
  respuestas_parciales: Record<string, any>;
  estado: EstadoEncuesta;
}

// Respuesta de la API al guardar progreso
export interface GuardarProgresoResponse {
  success: boolean;
  message?: string;
  data?: EncuestaProgreso;
}

// Respuesta de la API al obtener progreso
export interface ObtenerProgresoResponse {
  success: boolean;
  data: EncuestaProgreso | null;
}

export type {
  PreguntaId // 1-4
};
