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
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:people,email|max:255',
            'pais' => 'required|string|max:255',
            // En DB se guarda en "whatsapp". Aceptamos "whatsapp" (nuevo) o "telefono" (legacy).
            'whatsapp' => 'required_without:telefono|string|max:255|unique:people,whatsapp',
            'telefono' => 'required_without:whatsapp|string|max:255|unique:people,whatsapp',
        ]);

        $whatsapp = $validated['whatsapp'] ?? $validated['telefono'];

        $person = People::create([
            'whatsapp' => $whatsapp,
            'nombre' => $validated['nombre'],
            'apellido' => $validated['apellido'],
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
                // compat: algunos clientes esperan "telefono"
                'telefono' => $person->whatsapp,
                'whatsapp' => $person->whatsapp,
                'nombre' => $person->nombre,
                'apellido' => $person->apellido,
                'email' => $person->email,
                'pais' => $person->pais,
            ]
        ], 201);
    }
}
