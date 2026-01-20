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
            'whatsapp' => 'required|string|max:255|unique:people,whatsapp',
        ]);

        $person = People::create([
            'whatsapp' => $validated['whatsapp'],
            'nombre' => $validated['nombre'],
            'apellido' => $validated['apellido'],
            'email' => $validated['email'],
            'pais' => $validated['pais'],
        ]);

        // Auto-login after registration using session
        Auth::login($person);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->json([
            'success' => true,
            'message' => '¡Registro exitoso!',
            'data' => [
                'whatsapp' => $person->whatsapp,
                'nombre' => $person->nombre,
                'apellido' => $person->apellido,
                'email' => $person->email,
                'pais' => $person->pais,
            ]
        ], 201);
    }
    /**
     * Valida la aceptación de los términos y condiciones.
     */
    public function condiciones(Request $request)
    {
        // Validación estricta: El campo 'acepta_terminos' debe ser verdadero
        $request->validate([
            'acepta_terminos' => 'required|accepted',
        ]);

        // Opcional: Si el usuario ya está autenticado, puedes guardar la fecha
        // if ($request->user()) {
        //     $request->user()->forceFill(['terms_accepted_at' => now()])->save();
        // }

        return response()->json([
            'status' => 'success',
            'message' => 'Términos y condiciones aceptados correctamente.',
        ], 200);
    }
}
