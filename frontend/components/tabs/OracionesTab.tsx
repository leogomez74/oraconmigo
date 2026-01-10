'use client';

import { useState, useEffect } from 'react';
import { apiRequest, getCsrfCookie } from '@/lib/auth';
import PremiumBanner from '@/components/PremiumBanner';
import LoadingSpinner from '@/components/LoadingSpinner';
import UpgradeModal from '@/components/UpgradeModal';

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

interface OracionDetail extends Oracion {
  contenido_texto: string;
  audio_url: string | null;
}

interface OracionesTabProps {
  onBack: () => void;
}

export default function OracionesTab({ onBack }: OracionesTabProps) {
  // View State
  const [view, setView] = useState<'list' | 'detail'>('list');

  // List State
  const [oraciones, setOraciones] = useState<Oracion[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [loadingList, setLoadingList] = useState(false);

  // Detail State
  const [selectedOracionId, setSelectedOracionId] = useState<number | null>(null);
  const [oracionDetail, setOracionDetail] = useState<OracionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [completando, setCompletando] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Simulación: Por ahora el usuario NO es premium
  // TODO: Obtener del backend cuando se implemente el campo is_premium
  const isPremiumUser = false;

  // Initial Fetch
  useEffect(() => {
    fetchCategorias();
    fetchOraciones();
  }, []);

  // --- List Functions ---

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
    setLoadingList(true);
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
      setLoadingList(false);
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
    setSelectedOracionId(id);
    fetchOracionDetail(id);
    setView('detail');
  };

  // --- Detail Functions ---

  const fetchOracionDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      await getCsrfCookie();
      const response = await apiRequest(`/api/oraciones/${id}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (data.success) {
        setOracionDetail(data.oracion);
      }
    } catch (error) {
      console.error('Error fetching oracion detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCompletar = async () => {
    if (!oracionDetail) return;

    setCompletando(true);
    try {
      await getCsrfCookie();
      const response = await apiRequest(`/api/oraciones/${oracionDetail.id}/completar`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        // Actualizar el estado local del detalle
        setOracionDetail({
          ...oracionDetail,
          user_progress: {
            progreso: 100,
            completada_at: new Date().toISOString(),
          },
        });
        // Actualizar también la lista para reflejar el cambio al volver
        setOraciones(prev => prev.map(o => 
          o.id === oracionDetail.id 
            ? { ...o, user_progress: { progreso: 100, completada_at: new Date().toISOString() } } 
            : o
        ));
      }
    } catch (error) {
      console.error('Error completando oracion:', error);
    } finally {
      setCompletando(false);
    }
  };

  // --- Helpers ---

  const formatDuracion = (segundos: number | null) => {
    if (!segundos) return null;
    const minutos = Math.floor(segundos / 60);
    if (view === 'detail') {
        const segs = segundos % 60;
        return `${minutos}:${segs.toString().padStart(2, '0')}`;
    }
    return `${minutos} min`;
  };

  const handleBack = () => {
    if (view === 'detail') {
      setView('list');
      setOracionDetail(null);
      setSelectedOracionId(null);
    } else {
      onBack();
    }
  };

  // --- Render ---

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">
              {view === 'list' ? 'Oraciones Guiadas' : oracionDetail?.titulo || 'Cargando...'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        
        {/* VIEW: LIST */}
        {view === 'list' && (
          <>
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

            {/* Loading List */}
            {loadingList && (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Lista de oraciones */}
            {!loadingList && (
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
            
            <PremiumBanner variant="list" className="mt-6" />
          </>
        )}

        {/* VIEW: DETAIL */}
        {view === 'detail' && (
          <>
            {loadingDetail || !oracionDetail ? (
              <div className="flex justify-center p-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                 {/* Info de la oración */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                      {oracionDetail.categoria}
                    </span>
                    {oracionDetail.es_premium && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                        Premium
                      </span>
                    )}
                    {oracionDetail.user_progress?.completada_at && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Completada
                      </span>
                    )}
                  </div>

                  {oracionDetail.descripcion && (
                    <p className="text-gray-600 mb-4">{oracionDetail.descripcion}</p>
                  )}

                  {oracionDetail.duracion && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Duración: {formatDuracion(oracionDetail.duracion)}</span>
                    </div>
                  )}
                </div>

                {/* Contenido de la oración */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Oración</h2>
                  {oracionDetail.es_premium && !isPremiumUser ? (
                    <div className="relative">
                      {/* Preview del texto (primeras 3 líneas) */}
                      <div className="prose max-w-none mb-4">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                          {oracionDetail.contenido_texto.split('\n').slice(0, 3).join('\n')}
                          {oracionDetail.contenido_texto.split('\n').length > 3 && '...'}
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
                        {oracionDetail.contenido_texto}
                      </p>
                    </div>
                  )}
                </div>

                {/* Audio (si existe) */}
                {oracionDetail.audio_url && !(oracionDetail.es_premium && !isPremiumUser) && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Audio de la oración</h3>
                    <audio controls className="w-full">
                      <source src={oracionDetail.audio_url} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                )}

                {/* Botón de completar */}
                {!oracionDetail.user_progress?.completada_at && !(oracionDetail.es_premium && !isPremiumUser) && (
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

                {oracionDetail.user_progress?.completada_at && !(oracionDetail.es_premium && !isPremiumUser) && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-800 font-medium">Has completado esta oración</p>
                    {oracionDetail.user_progress?.completada_at && (
                      <p className="text-sm text-green-600 mt-1">
                        Completada el {new Date(oracionDetail.user_progress.completada_at).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Modal de upgrade */}
                 <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    feature={oracionDetail.titulo}
                  />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
