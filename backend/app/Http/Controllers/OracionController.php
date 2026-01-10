<?php

namespace App\Http\Controllers;

use App\Models\Oracion;
use App\Models\OracionUsuario;
use Illuminate\Http\Request;

class OracionController extends Controller
{
    /**
     * Lista todas las oraciones disponibles
     * Filtros: categoria, es_premium
     */
    public function index(Request $request)
    {
        $query = Oracion::query()->ordenado();

        // Filtrar por categoría
        if ($request->has('categoria')) {
            $query->categoria($request->categoria);
        }

        // Filtrar por tipo (gratuitas/premium)
        if ($request->has('tipo')) {
            if ($request->tipo === 'gratuitas') {
                $query->gratuitas();
            } elseif ($request->tipo === 'premium') {
                $query->premium();
            }
        }

        $oraciones = $query->get();

        // Obtener progreso del usuario para cada oración
        $userId = $request->user()->id;
        $oraciones->map(function ($oracion) use ($userId) {
            $userProgress = OracionUsuario::where('people_id', $userId)
                ->where('oracion_id', $oracion->id)
                ->first();

            $oracion->user_progress = $userProgress ? [
                'progreso' => $userProgress->progreso,
                'completada_at' => $userProgress->completada_at,
            ] : null;

            return $oracion;
        });

        return response()->json([
            'success' => true,
            'oraciones' => $oraciones,
        ]);
    }

    /**
     * Obtiene el detalle de una oración específica
     */
    public function show(Request $request, $id)
    {
        $oracion = Oracion::find($id);

        if (!$oracion) {
            return response()->json([
                'success' => false,
                'message' => 'Oración no encontrada',
            ], 404);
        }

        // Obtener progreso del usuario
        $userProgress = OracionUsuario::where('people_id', $request->user()->id)
            ->where('oracion_id', $oracion->id)
            ->first();

        $oracion->user_progress = $userProgress ? [
            'progreso' => $userProgress->progreso,
            'completada_at' => $userProgress->completada_at,
        ] : null;

        return response()->json([
            'success' => true,
            'oracion' => $oracion,
        ]);
    }

    /**
     * Marca una oración como completada
     */
    public function completar(Request $request, $id)
    {
        $oracion = Oracion::find($id);

        if (!$oracion) {
            return response()->json([
                'success' => false,
                'message' => 'Oración no encontrada',
            ], 404);
        }

        // Buscar o crear el registro de progreso
        $oracionUsuario = OracionUsuario::firstOrCreate(
            [
                'people_id' => $request->user()->id,
                'oracion_id' => $oracion->id,
            ],
            [
                'progreso' => 0,
            ]
        );

        // Marcar como completada
        $oracionUsuario->marcarCompletada();

        return response()->json([
            'success' => true,
            'message' => 'Oración completada',
            'oracion_usuario' => $oracionUsuario,
        ]);
    }

    /**
     * Actualiza el progreso de una oración
     */
    public function actualizarProgreso(Request $request, $id)
    {
        $validated = $request->validate([
            'progreso' => 'required|integer|min:0|max:100',
        ]);

        $oracion = Oracion::find($id);

        if (!$oracion) {
            return response()->json([
                'success' => false,
                'message' => 'Oración no encontrada',
            ], 404);
        }

        // Buscar o crear el registro de progreso
        $oracionUsuario = OracionUsuario::updateOrCreate(
            [
                'people_id' => $request->user()->id,
                'oracion_id' => $oracion->id,
            ],
            [
                'progreso' => $validated['progreso'],
            ]
        );

        // Si llegó al 100%, marcar como completada
        if ($validated['progreso'] >= 100 && !$oracionUsuario->completada_at) {
            $oracionUsuario->marcarCompletada();
        }

        return response()->json([
            'success' => true,
            'message' => 'Progreso actualizado',
            'oracion_usuario' => $oracionUsuario,
        ]);
    }

    /**
     * Obtiene oraciones recomendadas (basadas en categorías populares o encuesta)
     */
    public function recomendadas(Request $request)
    {
        // Por ahora, devolver oraciones gratuitas populares
        // TODO: Implementar lógica basada en respuestas de encuesta
        $oraciones = Oracion::gratuitas()
            ->ordenado()
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'oraciones' => $oraciones,
        ]);
    }

    /**
     * Obtiene las categorías disponibles
     */
    public function categorias(Request $request)
    {
        $categorias = Oracion::select('categoria')
            ->distinct()
            ->orderBy('categoria')
            ->pluck('categoria');

        return response()->json([
            'success' => true,
            'categorias' => $categorias,
        ]);
    }
}
