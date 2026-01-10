<?php

namespace App\Http\Controllers;

use App\Models\Encuesta;
use Illuminate\Http\Request;

class EncuestaController extends Controller
{
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
}
