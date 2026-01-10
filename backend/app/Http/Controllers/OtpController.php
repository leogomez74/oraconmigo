<?php

namespace App\Http\Controllers;

use App\Models\OtpCode;
use App\Models\People;
use Illuminate\Http\Request;

class OtpController extends Controller
{
    /**
     * Send OTP code to email
     * TODO: Implement email sending logic
     */
    public function send(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:people,email',
        ]);

        // TODO: Generate 6-digit OTP code
        // TODO: Save to database with expiration (5 minutes)
        // TODO: Send email with OTP code
        // TODO: Return success response

        return response()->json([
            'success' => true,
            'message' => 'Código OTP enviado a tu correo electrónico',
            // TODO: Remove this in production
            'debug_note' => 'OTP logic not implemented yet'
        ]);
    }

    /**
     * Verify OTP code and login
     * TODO: Implement OTP verification logic
     */
    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        // TODO: Find OTP code in database
        // TODO: Validate OTP (not expired, not used, matches code)
        // TODO: Mark OTP as used
        // TODO: Find user by email
        // TODO: Create Sanctum token
        // TODO: Return token and user data

        return response()->json([
            'success' => true,
            'message' => 'OTP verificado correctamente',
            // TODO: Remove this in production
            'debug_note' => 'OTP verification logic not implemented yet',
            'token' => 'placeholder_token',
            'user' => [
                'id' => 1,
                'nombre' => 'Placeholder',
                'email' => $request->email,
            ]
        ]);
    }
}
