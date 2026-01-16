<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Respuesta;

class RespuestaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'respuestas' => 'required|array',
        ]);

        $respuesta = Respuesta::create([
            'people_id' => $request->user()->telefono,
            'respuestas' => $validated['respuestas'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Respuesta guardada exitosamente',
            'data' => $respuesta,
        ], 201);
    }
}
