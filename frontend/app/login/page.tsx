'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('code');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and redirect to encuesta page
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/encuesta';
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl sha
      dow-sm w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">
          Iniciar Sesión
        </h1>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Recibirás un código de 6 dígitos en tu email.
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-10">
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tucorreo@ejemplo.com"
                required
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 sm:py-5 px-6 text-lg sm:text-xl font-semibold rounded-xl active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>

            <div className="text-center">
              <p className="text-base text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/" className="text-blue-600 font-semibold text-base">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800">
                Código enviado a <strong>{email}</strong>
              </p>
            </div>

            <div className="mb-10">
              <label htmlFor="code" className="block text-base font-medium text-gray-700 mb-3">
                Código de 6 dígitos
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-4 text-base text-gray-900 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
              />
              {errors.code && (
                <p className="mt-2 text-sm text-red-600">{errors.code[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-4 sm:py-5 px-6 text-lg sm:text-xl font-semibold rounded-xl active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-gray-600 py-3 text-base font-medium"
            >
              ← Volver a ingresar email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
