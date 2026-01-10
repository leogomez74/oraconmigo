<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Respuesta;

class RespuestaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'encuesta_id' => 'required|exists:encuesta,id',
            'respuestas' => 'required|array',
        ]);

        $respuesta = Respuesta::create([
            'encuesta_id' => $validated['encuesta_id'],
            'people_id' => $request->user()->id,
            'respuestas' => $validated['respuestas'],
        ]);

        return response()->json([
            'message' => 'Respuesta guardada exitosamente',
            'data' => $respuesta,
        ], 201);
    }
}
