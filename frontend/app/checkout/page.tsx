'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkAuth as authCheck } from '@/lib/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'mensual';

  const [authLoading, setAuthLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    nombreTarjeta: '',
    numeroTarjeta: '',
    expiracion: '',
    cvv: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authCheck();

      if (!userData) {
        router.push('/');
        return;
      }

      setAuthLoading(false);
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    }
  };

  const precioMensual = 4.99;
  const precioAnual = 39.99;
  const precio = plan === 'mensual' ? precioMensual : precioAnual;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // Formatear número de tarjeta
    if (name === 'numeroTarjeta') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.substring(0, 19);
    }

    // Formatear expiración
    if (name === 'expiracion') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      if (value.length > 5) value = value.substring(0, 5);
    }

    // Limitar CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      setProcessing(false);
      router.push('/checkout/success');
    }, 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/planes')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Resumen del Plan */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Plan Premium</h2>
              <p className="text-indigo-200 text-sm capitalize">{plan}</p>
            </div>
          </div>
          <div className="flex items-baseline justify-between border-t border-indigo-400 pt-4">
            <span className="text-indigo-200">Total a pagar</span>
            <div className="text-right">
              <div className="text-4xl font-bold">${precio.toFixed(2)}</div>
              <div className="text-sm text-indigo-200">
                {plan === 'mensual' ? 'por mes' : 'por año'}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Pago */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Información de Pago
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="nombreTarjeta" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre en la tarjeta
                </label>
                <input
                  type="text"
                  id="nombreTarjeta"
                  name="nombreTarjeta"
                  value={formData.nombreTarjeta}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label htmlFor="numeroTarjeta" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  value={formData.numeroTarjeta}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiracion" className="block text-sm font-medium text-gray-700 mb-2">
                    Expiración
                  </label>
                  <input
                    type="text"
                    id="expiracion"
                    name="expiracion"
                    value={formData.expiracion}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 text-sm">Pago seguro</h4>
              <p className="text-xs text-blue-700">Tus datos están protegidos con encriptación de nivel bancario</p>
            </div>
          </div>

          {/* Términos */}
          <div className="text-xs text-gray-600 text-center">
            Al hacer clic en "Confirmar pago", aceptas los{' '}
            <a href="#" className="text-indigo-600 underline">Términos de servicio</a> y la{' '}
            <a href="#" className="text-indigo-600 underline">Política de privacidad</a>.
            {plan === 'mensual' && (
              <> Tu suscripción se renovará automáticamente cada mes. Puedes cancelar en cualquier momento.</>
            )}
            {plan === 'anual' && (
              <> Tu suscripción se renovará automáticamente cada año. Puedes cancelar en cualquier momento.</>
            )}
          </div>

          {/* Botón de pago */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl p-4 font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Procesando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Confirmar pago de ${precio.toFixed(2)}
              </>
            )}
          </button>
        </form>

        {/* Tarjetas aceptadas */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Aceptamos</p>
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-600">VISA</div>
            <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-600">Mastercard</div>
            <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-600">AMEX</div>
          </div>
        </div>
      </div>
    </div>
  );
}
