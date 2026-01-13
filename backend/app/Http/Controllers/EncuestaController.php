<?php

namespace App\Http\Controllers;

use App\Models\Encuesta;
use App\Models\EncuestaProgreso;
use Illuminate\Http\Request;
use Exception;
use \Illuminate\Validation\ValidationException;
class EncuestaController extends Controller
{
    // Constantes para la encuesta
    const TOTAL_PASOS = 4;
    const PREGUNTAS_POR_PASO = 2;
    const AUTOSAVE_DELAY_MS = 3000; // 3 segundos (estándar industria)
    public function index(Request $request)
    {
        $encuestas = Encuesta::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $encuestas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pregunta' => 'required|string',
        ]);

        $encuesta = Encuesta::create($validated);

        return response()->json([
            'success' => true,
            'message' => '¡Encuesta creada exitosamente!',
            'data' => $encuesta
        ], 201);
    }

    /**
     * Guarda el progreso del usuario en la encuesta
     * Llamado automáticamente cada 3 segundos (debounce) o al hacer clic en "Siguiente"
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function guardarProgreso(Request $request)
    {
        try {
            $validated = $request->validate([
                'paso_actual' => 'required|integer|min:1|max:' . self::TOTAL_PASOS,
                'ultimo_paso_completado' => 'required|integer|min:0|max:' . self::TOTAL_PASOS,
                'ultima_pregunta_vista' => 'required|string',
                'respuestas_parciales' => 'required|array',
                'estado' => 'required|string|in:sin_iniciar,en_progreso,completada,abandonada',
            ]);

            // Extraer IDs de preguntas respondidas
            $preguntasRespondidas = array_keys($validated['respuestas_parciales']);

            // Crear o actualizar progreso del usuario
            $progreso = EncuestaProgreso::updateOrCreate(
                ['people_id' => $request->user()->id],
                [
                    'paso_actual' => $validated['paso_actual'],
                    'ultimo_paso_completado' => $validated['ultimo_paso_completado'],
                    'ultima_pregunta_vista' => $validated['ultima_pregunta_vista'],
                    'preguntas_respondidas' => $preguntasRespondidas,
                    'respuestas_parciales' => $validated['respuestas_parciales'],
                    'estado' => $validated['estado'],
                    'ultima_interaccion_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Progreso guardado correctamente',
                'data' => $progreso,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar progreso',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene el progreso actual del usuario autenticado
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function obtenerProgreso(Request $request)
    {
        try {
            $progreso = EncuestaProgreso::where('people_id', $request->user()->id)->first();

            return response()->json([
                'success' => true,
                'data' => $progreso,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener progreso',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Marca la encuesta como completada
     * Llamado cuando el usuario envía el último paso
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function marcarCompletada(Request $request)
    {
        try {
            $progreso = EncuestaProgreso::where('people_id', $request->user()->id)->first();

            if (!$progreso) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró progreso de encuesta para este usuario',
                ], 404);
            }

            $progreso->update([
                'estado' => 'completada',
                'completada' => true,
                'ultimo_paso_completado' => self::TOTAL_PASOS,
                'ultima_interaccion_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Encuesta marcada como completada',
                'data' => $progreso,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar encuesta como completada',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
