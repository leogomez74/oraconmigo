'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth as authCheck, apiRequest, getCsrfCookie } from '@/lib/auth';
import PremiumBanner from '@/components/PremiumBanner';

interface Oracion {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string | null;
  duracion: number | null;
  es_premium: boolean;
  user_progress: {
    progreso: number;
    completada_at: string | null;
  } | null;
}

export default function OracionesPage() {
  const router = useRouter();
  const [oraciones, setOraciones] = useState<Oracion[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

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
      fetchCategorias();
      fetchOraciones();
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    }
  };

  const fetchCategorias = async () => {
    try {
      await getCsrfCookie();
      const response = await apiRequest('/api/oraciones/categorias', {
        method: 'GET',
      });
      const data = await response.json();
      if (data.success) {
        setCategorias(data.categorias);
      }
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const fetchOraciones = async (categoria?: string) => {
    setLoading(true);
    try {
      await getCsrfCookie();
      const url = categoria
        ? `/api/oraciones?categoria=${encodeURIComponent(categoria)}`
        : '/api/oraciones';

      const response = await apiRequest(url, {
        method: 'GET',
      });
      const data = await response.json();

      if (data.success) {
        setOraciones(data.oraciones);
      }
    } catch (error) {
      console.error('Error fetching oraciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    if (categoria === '') {
      fetchOraciones();
    } else {
      fetchOraciones(categoria);
    }
  };

  const handleOracionClick = (id: number) => {
    router.push(`/oracion/${id}`);
  };

  const formatDuracion = (segundos: number | null) => {
    if (!segundos) return null;
    const minutos = Math.floor(segundos / 60);
    return `${minutos} min`;
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Oraciones Guiadas</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Filtro por categoría */}
        {categorias.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => handleCategoriaChange('')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  categoriaSeleccionada === ''
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-500'
                }`}
              >
                Todas
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => handleCategoriaChange(categoria)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    categoriaSeleccionada === categoria
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Lista de oraciones */}
        {!loading && (
          <div className="space-y-4">
            {oraciones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay oraciones disponibles</p>
              </div>
            ) : (
              oraciones.map((oracion) => (
                <button
                  key={oracion.id}
                  onClick={() => handleOracionClick(oracion.id)}
                  className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-indigo-500 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{oracion.titulo}</h3>
                        {oracion.es_premium && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Premium
                          </span>
                        )}
                        {oracion.user_progress?.completada_at && (
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {oracion.descripcion && (
                        <p className="text-sm text-gray-600 mb-2">{oracion.descripcion}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                          {oracion.categoria}
                        </span>
                        {oracion.duracion && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDuracion(oracion.duracion)}
                          </span>
                        )}
                      </div>
                      {oracion.user_progress && oracion.user_progress.progreso > 0 && oracion.user_progress.progreso < 100 && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${oracion.user_progress.progreso}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
        
        {/* Premium Banner */}
        <PremiumBanner variant="list" className="mt-6" />
      </div>
    </div>
  );
}
