# OTP Authentication - Implementation Guide

## ✅ What's Already Done

### Database
- ✅ `otp_codes` table created with:
  - `email` - User's email address
  - `code` - 6-digit OTP code
  - `expires_at` - Expiration timestamp (typically 5 minutes)
  - `used` - Boolean flag to prevent reuse
  - Indexes on email and email+code for fast lookups

- ✅ Removed `password` column from `people` table
- ✅ OtpCode model created with helper methods

### Backend (Laravel)
- ✅ OtpController created with placeholder methods:
  - `POST /api/otp/send` - Send OTP to email
  - `POST /api/otp/verify` - Verify OTP and login
- ✅ Routes configured
- ✅ Registration updated (no password required)
- ✅ Sanctum already configured for token-based auth

### Frontend (Next.js)
- ✅ Password field removed from registration
- ✅ Info banner added explaining OTP coming soon
- ✅ Login page exists (will need to be updated for OTP)

## 🔨 What Needs to Be Implemented

### 1. OtpController::send() Method
```php
public function send(Request $request)
{
    // 1. Generate random 6-digit code
    $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    // 2. Delete old OTP codes for this email
    OtpCode::where('email', $request->email)->delete();

    // 3. Create new OTP code (expires in 5 minutes)
    OtpCode::create([
        'email' => $request->email,
        'code' => $code,
        'expires_at' => now()->addMinutes(5),
    ]);

    // 4. Send email with OTP code
    // Use Laravel Mail or a service like SendGrid, Mailgun, etc.
    // Mail::to($request->email)->send(new OtpMail($code));

    return response()->json([
        'success' => true,
        'message' => 'Código OTP enviado a tu correo electrónico'
    ]);
}
```

### 2. OtpController::verify() Method
```php
public function verify(Request $request)
{
    // 1. Find the OTP code
    $otp = OtpCode::where('email', $request->email)
        ->where('code', $request->code)
        ->where('used', false)
        ->first();

    // 2. Validate OTP exists and is valid
    if (!$otp || !$otp->isValid()) {
        return response()->json([
            'success' => false,
            'message' => 'Código OTP inválido o expirado'
        ], 422);
    }

    // 3. Mark OTP as used
    $otp->markAsUsed();

    // 4. Find or create user
    $person = People::where('email', $request->email)->first();

    // 5. Create Sanctum token
    $token = $person->createToken('mobile-app')->plainTextToken;

    // 6. Return token and user data
    return response()->json([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $person->id,
            'nombre' => $person->nombre,
            'email' => $person->email,
            'pais' => $person->pais,
        ]
    ]);
}
```

### 3. Email Configuration
Set up email in `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io  # Or your SMTP server
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@ora.com
MAIL_FROM_NAME="Ora App"
```

### 4. Create Email Template
```bash
php artisan make:mail OtpMail
```

### 5. Update Login Page (Frontend)
Replace password field with OTP flow:
1. Enter email → Send OTP
2. Enter 6-digit code → Verify and login

### 6. Security Considerations
- ✅ Rate limiting on OTP send (max 3 per 5 minutes)
- ✅ Expire OTPs after 5 minutes
- ✅ Single-use OTPs
- ✅ Clear old OTPs before creating new ones
- Consider adding IP-based rate limiting

## 📧 Recommended Email Services
- **Mailgun** - Good for production
- **SendGrid** - Good for production
- **Mailtrap** - Perfect for testing
- **Amazon SES** - Cost-effective for high volume

## 🔐 Testing Flow
1. Register user at `/register`
2. Use `/api/otp/send` to request OTP
3. Check email for 6-digit code
4. Use `/api/otp/verify` with code to login
5. Get Sanctum token → Access `/encuesta`

## Next Steps
1. Configure email service
2. Implement OTP send logic
3. Implement OTP verify logic
4. Create email template
5. Update frontend login page for OTP
6. Add rate limiting
7. Test thoroughly!
