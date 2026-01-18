<?php

namespace App\Http\Controllers;

use App\Models\People;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function adminLogout(Request $request)
    {
        // Reuse the same logout mechanics (web guard + session invalidation)
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return redirect()->route('login');
    }

    /*public function login(Request $request)
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
        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => [
                'id' => $person->id,
                'nombre' => $person->nombre,
                'email' => $person->email,
                'pais' => $person->pais,
            ]
        ]);
    }*/

    public function logout(Request $request)
    {
        // Logout de sesión (Sanctum SPA authentication)
        Auth::guard('web')->logout();

        // Invalidar y regenerar sesión
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }

    public function me(Request $request)
    {
        $person = People::find(Auth::id());
        return response()->json([
            'success' => true,
            'message' => 'Usuario obtenido correctamente',
            'data' => [
                'whatsapp' => $person->whatsapp,
                'nombre' => $person->nombre,
                'apellido' => $person->apellido,
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
            'clave' => 'nullable|string',
        ]);

        $person = People::where('email', $request->email)
            ->where('is_admin', true)
            ->first();

        if (!$person) {
            throw ValidationException::withMessages([
                'email' => ['No se encontró un administrador con este correo electrónico.'],
            ]);
        }

        // Si el admin tiene clave configurada, la exigimos.
        if (!empty($person->clave_hash)) {
            $clave = (string) ($request->input('clave') ?? '');
            if ($clave === '' || !Hash::check($clave, $person->clave_hash)) {
                throw ValidationException::withMessages([
                    'clave' => ['Clave incorrecta.'],
                ]);
            }
        }

        // Autenticar directamente
        Auth::login($person);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return redirect()->intended('/admin/dashboard');
    }
}

