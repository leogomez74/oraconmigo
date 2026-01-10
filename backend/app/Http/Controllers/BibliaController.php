<?php

namespace App\Http\Controllers;

use App\Models\BibleReading;
use Illuminate\Http\Request;

class BibliaController extends Controller
{
    /**
     * Registra la lectura de un capítulo de la Biblia
     */
    public function registrar(Request $request)
    {
        $validated = $request->validate([
            'book' => 'required|string|max:255',
            'chapter' => 'required|integer|min:1',
        ]);

        // Verificar si ya existe un registro de esta lectura (evitar duplicados del mismo día)
        $existingReading = BibleReading::where('people_id', $request->user()->id)
            ->where('book', $validated['book'])
            ->where('chapter', $validated['chapter'])
            ->whereDate('created_at', today())
            ->first();

        if ($existingReading) {
            return response()->json([
                'success' => true,
                'message' => 'Lectura ya registrada hoy',
            ]);
        }

        // Crear nuevo registro de lectura
        BibleReading::create([
            'people_id' => $request->user()->id,
            'book' => $validated['book'],
            'chapter' => $validated['chapter'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lectura registrada correctamente',
        ]);
    }
}
