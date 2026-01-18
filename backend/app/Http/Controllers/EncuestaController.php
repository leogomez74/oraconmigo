<?php

namespace App\Http\Controllers;

use App\Models\Encuesta;
use App\Models\EncuestaProgreso;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Config;
use \Illuminate\Validation\ValidationException;
class EncuestaController extends Controller
{
    // Constantes para la encuesta
    const TOTAL_PASOS = 21;

    private function getEncuestaTotalPasos(): int
    {
        $count = Encuesta::count();

        return $count > 0 ? $count : self::TOTAL_PASOS;
    }

    public function index(Request $request)
    {
        $query = Encuesta::query();

        // Si ya tenemos preguntas con codigo, preferimos solo esas (evita duplicados legacy)
        if (Encuesta::whereNotNull('codigo')->exists()) {
            $query->whereNotNull('codigo');
        }

        $encuestas = $query->orderBy('id')->get();

        $data = $encuestas->map(function (Encuesta $encuesta) {
            $stableId = $encuesta->codigo ?: (string) $encuesta->id;

            return [
                // Mantener un id estable (string) para respuestas/analytics
                'id' => $stableId,
                // Exponer id numérico por si alguien lo necesita
                'db_id' => $encuesta->id,
                'codigo' => $encuesta->codigo,
                'pregunta' => $encuesta->pregunta,
                'tipo' => $encuesta->tipo,
                'opciones' => $encuesta->opciones,
                // Compat frontend
                'requerida' => (bool) $encuesta->obligatoria,
                // Mantener nombre backend
                'obligatoria' => (bool) $encuesta->obligatoria,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'nullable|string|max:255',
            'pregunta' => 'required|string',
            'tipo' => 'nullable|string|max:255',
            'opciones' => 'nullable|array',
            'obligatoria' => 'nullable|boolean',
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
            $totalPasos = $this->getEncuestaTotalPasos();
            $validated = $request->validate([
                'paso_actual' => 'required|integer|min:1|max:' . $totalPasos,
                'ultimo_paso_completado' => 'required|integer|min:0|max:' . $totalPasos,
                'ultima_pregunta_vista' => 'required|string',
                'respuestas_parciales' => 'required|array',
                'estado' => 'required|string|in:sin_iniciar,en_progreso,completada,abandonada',
            ]);

            // Extraer IDs de preguntas respondidas
            $preguntasRespondidas = array_keys($validated['respuestas_parciales']);

            // Crear o actualizar progreso del usuario
            $peopleKey = $request->user()->getKey();

            if (!$peopleKey) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario inválido (sin teléfono/whatsapp)',
                ], 400);
            }

            $progreso = EncuestaProgreso::updateOrCreate(
                ['people_id' => $peopleKey],
                [
                    'paso_actual' => $validated['paso_actual'],
                    'ultimo_paso_completado' => $validated['ultimo_paso_completado'],
                    'ultima_pregunta_vista' => $validated['ultima_pregunta_vista'],
                    'preguntas_respondidas' => $preguntasRespondidas,
                    'respuestas_parciales' => $validated['respuestas_parciales'],
                    'estado' => $validated['estado'],
                    'completada' => $validated['estado'] === 'completada',
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
                'data' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar progreso',
                'data' => $e->getMessage(),
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
            $peopleKey = $request->user()->getKey();

            if (!$peopleKey) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario inválido (sin teléfono/whatsapp)',
                    'data' => null,
                ], 400);
            }

            $progreso = EncuestaProgreso::where('people_id', $peopleKey)->first();

            return response()->json([
                'success' => true,
                'message' => 'Progreso obtenido correctamente',
                'data' => $progreso,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener progreso',
                'data' => $e->getMessage(),
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
            $totalPasos = $this->getEncuestaTotalPasos();
            $peopleKey = $request->user()->getKey();

            if (!$peopleKey) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario inválido (sin teléfono/whatsapp)',
                ], 400);
            }

            $progreso = EncuestaProgreso::where('people_id', $peopleKey)->first();

            if (!$progreso) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró progreso de encuesta para este usuario',
                ], 404);
            }

            $progreso->update([
                'estado' => 'completada',
                'completada' => true,
                'ultimo_paso_completado' => $totalPasos,
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
                'data' => $e->getMessage(),
            ], 500);
        }
    }
}
