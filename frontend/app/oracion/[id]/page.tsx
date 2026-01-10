'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { checkAuth as authCheck, apiRequest, getCsrfCookie } from '@/lib/auth';
import UpgradeModal from '@/components/UpgradeModal';

interface Oracion {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string | null;
  contenido_texto: string;
  audio_url: string | null;
  duracion: number | null;
  es_premium: boolean;
  user_progress: {
    progreso: number;
    completada_at: string | null;
  } | null;
}

export default function OracionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [oracion, setOracion] = useState<Oracion | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [completando, setCompletando] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Simulación: Por ahora el usuario NO es premium
  // TODO: Obtener del backend cuando se implemente el campo is_premium
  const isPremiumUser = false;

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
      fetchOracion();
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    }
  };

  const fetchOracion = async () => {
    setLoading(true);
    try {
      await getCsrfCookie();
      const response = await apiRequest(`/api/oraciones/${id}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (data.success) {
        setOracion(data.oracion);
      }
    } catch (error) {
      console.error('Error fetching oracion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletar = async () => {
    if (!oracion) return;

    setCompletando(true);
    try {
      await getCsrfCookie();
      const response = await apiRequest(`/api/oraciones/${id}/completar`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        // Actualizar el estado local
        setOracion({
          ...oracion,
          user_progress: {
            progreso: 100,
            completada_at: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error('Error completando oracion:', error);
    } finally {
      setCompletando(false);
    }
  };

  const formatDuracion = (segundos: number | null) => {
    if (!segundos) return null;
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!oracion) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Oración no encontrada</p>
          <button
            onClick={() => router.push('/oracion')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Volver a oraciones
          </button>
        </div>
      </div>
    );
  }

  const yaCompletada = !!(oracion.user_progress && oracion.user_progress.completada_at);
  const isBlocked = oracion.es_premium && !isPremiumUser;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/oracion')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">
              {oracion.titulo}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Info de la oración */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
              {oracion.categoria}
            </span>
            {oracion.es_premium && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Premium
              </span>
            )}
            {yaCompletada && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completada
              </span>
            )}
          </div>

          {oracion.descripcion && (
            <p className="text-gray-600 mb-4">{oracion.descripcion}</p>
          )}

          {oracion.duracion && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Duración: {formatDuracion(oracion.duracion)}</span>
            </div>
          )}
        </div>

        {/* Contenido de la oración */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Oración</h2>
          {isBlocked ? (
            <div className="relative">
              {/* Preview del texto (primeras 3 líneas) */}
              <div className="prose max-w-none mb-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {oracion.contenido_texto.split('\n').slice(0, 3).join('\n')}
                  {oracion.contenido_texto.split('\n').length > 3 && '...'}
                </p>
              </div>

              {/* Overlay de blur */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white backdrop-blur-sm"></div>

              {/* Candado y CTA */}
              <div className="relative mt-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Contenido Premium</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Desbloquea esta oración y todo el contenido premium con una suscripción
                </p>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Actualizar a Premium
                </button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {oracion.contenido_texto}
              </p>
            </div>
          )}
        </div>

        {/* Audio (si existe) */}
        {oracion.audio_url && !isBlocked && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Audio de la oración</h3>
            <audio controls className="w-full">
              <source src={oracion.audio_url} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}

        {/* Botón de completar */}
        {!yaCompletada && !isBlocked && (
          <button
            onClick={handleCompletar}
            disabled={completando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl p-4 font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {completando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Completando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Marcar como completada
              </>
            )}
          </button>
        )}

        {yaCompletada && !isBlocked && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium">Has completado esta oración</p>
            {oracion.user_progress?.completada_at && (
              <p className="text-sm text-green-600 mt-1">
                Completada el {new Date(oracion.user_progress.completada_at).toLocaleDateString('es-ES')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal de upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={oracion.titulo}
      />
    </div>
  );
}
