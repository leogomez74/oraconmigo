<?php

namespace App\Http\Controllers;

use App\Models\People;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistrationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:people,email|max:255',
            'pais' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:255|unique:people,telefono',
        ]);

        $person = People::create([
            'telefono' => $validated['whatsapp'],
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'pais' => $validated['pais'],
        ]);

        // Auto-login after registration using session
        Auth::login($person);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => '¡Registro exitoso!',
            'data' => [
                'telefono' => $person->telefono,
                'nombre' => $person->nombre,
                'email' => $person->email,
                'pais' => $person->pais,
            ]
        ], 201);
    }
}
