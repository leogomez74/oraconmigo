import { useEffect, useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from './useDebounce';
import { apiRequest } from '@/lib/auth';
import type { GuardarProgresoPayload, PreguntaId } from '@/lib/encuesta-types';

interface UseEncuestaAutoSaveOptions {
  currentStep: number;
  currentAnswers: Record<string, any>;
  lastSavedAnswers: Record<string, any>;
  currentQuestionId: PreguntaId;
  isSubmitted: boolean;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export function useEncuestaAutoSave({
  currentStep,
  currentAnswers,
  lastSavedAnswers,
  currentQuestionId,
  isSubmitted,
  onSaveSuccess,
  onSaveError,
}: UseEncuestaAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedAnswersRef = useRef(lastSavedAnswers);
  
  // 1. Usamos un REF para los datos de navegación. 
  // Esto permite que las funciones de guardado accedan al paso/pregunta actual
  // sin tener que recrearse (evita bucles y cancelaciones del debounce).
  const navStateRef = useRef({ currentStep, currentQuestionId });
  useEffect(() => {
    navStateRef.current = { currentStep, currentQuestionId };
  }, [currentStep, currentQuestionId]);

  /**
   * FUNCIÓN PRINCIPAL DE GUARDADO (Via apiRequest)
   */
  const saveImmediately = useCallback(async (answers: Record<string, any>, estado: string = 'en_progreso') => {
    if (isSubmitted) return;

    setIsSaving(true);
    try {
      const { currentStep: step, currentQuestionId: qId } = navStateRef.current;
      
      const payload: GuardarProgresoPayload = {
        paso_actual: step,
        ultimo_paso_completado: estado === 'completada' ? step : step - 1,
        ultima_pregunta_vista: qId,
        respuestas_parciales: answers,
        estado: estado as any,
      };

      await apiRequest('/api/encuesta/progreso', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      lastSavedAnswersRef.current = { ...answers };
      onSaveSuccess?.();
    } catch (error) {
      console.error('Error saving progress:', error);
      onSaveError?.(error instanceof Error ? error : new Error('Error al guardar'));
    } finally {
      setIsSaving(false);
    }
  }, [isSubmitted, onSaveSuccess, onSaveError]);

  /**
   * GUARDADO DE EMERGENCIA (Al cerrar pestaña)
   * Sustituye a sendBeacon para evitar errores de CORS con Sanctum.
   */
  const saveOnExit = useCallback((answers: Record<string, any>) => {
    if (isSubmitted) return;

    const { currentStep: step, currentQuestionId: qId } = navStateRef.current;
    
    const payload: GuardarProgresoPayload = {
      paso_actual: step,
      ultimo_paso_completado: step - 1,
      ultima_pregunta_vista: qId,
      respuestas_parciales: answers,
      estado: 'en_progreso',
    };

    // Extraer token de las cookies para Sanctum
    const xsrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    // fetch + keepalive: sobrevive al cierre del navegador y permite Headers
    fetch('/api/encuesta/progreso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      },
      body: JSON.stringify(payload),
      keepalive: true, 
    }).catch(e => console.error("Exit save failed", e));
  }, [isSubmitted]);

  // Debounce para el guardado automático mientras escribe
  const debouncedSave = useDebouncedCallback(saveImmediately, 3000);

  /**
   * MANEJO DE EVENTOS DE CIERRE
   */
  useEffect(() => {
    if (isSubmitted) return;

    const hasUnsavedData = () => {
      return (
        Object.keys(currentAnswers).length > 0 &&
        JSON.stringify(currentAnswers) !== JSON.stringify(lastSavedAnswersRef.current)
      );
    };

    const handleExit = () => {
      if (hasUnsavedData()) {
        debouncedSave.cancel(); // Cancelamos el timer de 3s
        saveOnExit(currentAnswers); // Disparamos el fetch inmediato
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleExit();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    window.addEventListener('pagehide', handleExit);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleExit);
    };
  }, [currentAnswers, isSubmitted, debouncedSave, saveOnExit]);

  return {
    isSaving,
    saveImmediately,
    debouncedSave,
  };
}