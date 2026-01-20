'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import TerminosGenerales from '@/components/legal/terminosGenerales';
import TerminosPrivacidad from '@/components/legal/terminosPrivacidad';

function PrivacidadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Obtiene el parametro 'tab' de la URL. Por defecto muestra 'privacidad' si así lo prefieres,
  // o puedes mantener 'generales' como defecto. Aquí he puesto 'privacidad' como defecto dado el nombre de la ruta.
  const tab = searchParams.get('tab') || 'privacidad';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Navegación Superior tipo "Pestañas" */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => router.push('/privacidad?tab=generales')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 text-sm sm:text-base ${
              tab === 'generales'
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300 ring-opacity-50'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Términos Generales
          </button>
          <button
            onClick={() => router.push('/privacidad?tab=privacidad')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 text-sm sm:text-base ${
              tab === 'privacidad'
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300 ring-opacity-50'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Política de Privacidad
          </button>
        </div>

        {/* Renderizado Condicional */}
        {tab === 'generales' ? <TerminosGenerales /> : <TerminosPrivacidad />}

        {/* Botón Volver */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-2 mx-auto hover:underline transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al registro
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PrivacidadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
      <PrivacidadContent />
    </Suspense>
  );
}