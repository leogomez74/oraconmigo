<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Respuesta;
use App\Models\RespuestaMultiple;
use Illuminate\Support\Facades\DB;

class RespuestaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'respuestas' => 'required|array',
        ]);

<<<<<<< HEAD
        $peopleId = $request->user()->id;
=======
        $peopleId = $request->user()->whatsapp;
>>>>>>> 357fbd8 (cambio telefono a whatsapp)

        DB::beginTransaction();

        try {
            foreach ($validated['respuestas'] as $pregunta => $respuesta) {
                if (is_array($respuesta)) {
                    // Respuesta múltiple: crear registro con respuesta null
                    $respuestaModel = Respuesta::create([
                        'people_id' => $peopleId,
                        'pregunta' => $pregunta,
                        'respuesta' => null,
                    ]);

                    // Crear las opciones múltiples
                    foreach ($respuesta as $opcion) {
                        RespuestaMultiple::create([
                            'respuesta_id' => $respuestaModel->id,
                            'people_id' => $peopleId,
                            'opcion' => $opcion,
                        ]);
                    }
                } else {
                    // Respuesta única
                    Respuesta::create([
                        'people_id' => $peopleId,
                        'pregunta' => $pregunta,
                        'respuesta' => $respuesta,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Respuestas guardadas exitosamente',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar las respuestas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
