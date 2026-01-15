<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Respuesta;

class RespuestaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'encuesta_id' => 'nullable|exists:encuesta,id',
            'respuestas' => 'required|array',
        ]);

        $respuesta = Respuesta::create([
            'encuesta_id' => $validated['encuesta_id'] ?? null,
            'people_id' => $request->user()->id,
            'respuestas' => $validated['respuestas'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Respuesta guardada exitosamente',
            'data' => $respuesta,
        ], 201);
    }
}
