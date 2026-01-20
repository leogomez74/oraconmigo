'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import TerminosGenerales from '@/components/legal/terminosGenerales';
import TerminosPrivacidad from '@/components/legal/terminosPrivacidad';

function CondicionesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Obtiene el parametro 'tab' de la URL (ej: /condiciones?tab=privacidad)
  // Por defecto muestra 'generales' si no hay parametro
  const tab = searchParams.get('tab') || 'generales';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Navegación Superior */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => router.push('/condiciones?tab=generales')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              tab === 'generales'
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Términos Generales
          </button>
          <button
            onClick={() => router.push('/condiciones?tab=privacidad')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              tab === 'privacidad'
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Privacidad
          </button>
        </div>

        {/* Renderizado Condicional */}
        {tab === 'privacidad' ? <TerminosPrivacidad /> : <TerminosGenerales />}

        {/* Botón Volver */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-2 mx-auto"
          >
            ← Volver al registro
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CondicionesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <CondicionesContent />
    </Suspense>
  );
}