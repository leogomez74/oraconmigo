<?php

namespace App\Http\Controllers;

use App\Models\People;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $person = People::where('email', $request->email)->first();

        if (!$person || !Hash::check($request->password, $person->password ?? '')) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        Auth::login($person);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $person->id,
                'nombre' => $person->nombre,
                'email' => $person->email,
                'pais' => $person->pais,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    public function me(Request $request)
    {
        $person = People::find(Auth::id());
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $person->id,
                'nombre' => $person->nombre,
                'email' => $person->email,
                'pais' => $person->pais,
            ]
        ]);
    }

    /**
     * Login simple para administradores (solo email, sin password)
     */
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $person = People::where('email', $request->email)
            ->where('is_admin', true)
            ->first();

        if (!$person) {
            return response()->json([
                'success' => false,
                'message' => 'Email no encontrado o no tienes permisos de administrador',
            ], 403);
        }

        // Autenticar directamente
        Auth::login($person);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login exitoso',
            'user' => [
                'id' => $person->id,
                'nombre' => $person->nombre,
                'email' => $person->email,
                'is_admin' => $person->is_admin,
            ]
        ]);
    }
}
