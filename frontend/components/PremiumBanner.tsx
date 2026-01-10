'use client';

import { useRouter } from 'next/navigation';

interface PremiumBannerProps {
  variant?: 'card' | 'slim' | 'list';
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export default function PremiumBanner({
  variant = 'card',
  title = 'Descubre Premium',
  description = 'Accede a oraciones exclusivas con audio profesional y contenido nuevo cada semana',
  buttonText = 'Ver Planes Premium',
  className = ''
}: PremiumBannerProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/planes');
  };

  if (variant === 'slim') {
    return (
      <div className={`bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 flex items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 text-yellow-900">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-yellow-900 text-sm sm:text-base">¿Quieres profundizar más?</h3>
            <p className="text-xs sm:text-sm text-yellow-800 hidden sm:block">Desbloquea estudios bíblicos avanzados y devocionales.</p>
          </div>
        </div>
        <button
          onClick={handleClick}
          className="bg-yellow-900 hover:bg-yellow-950 text-yellow-50 text-xs sm:text-sm font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
        >
          Desbloquear
        </button>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <button
        onClick={handleClick}
        className={`w-full bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-xl shadow-md p-5 text-left group relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded uppercase tracking-wider">
                Premium
              </span>
            </div>
            <h3 className="font-bold text-white text-lg mb-1">Desbloquear todo el catálogo</h3>
            <p className="text-indigo-100 text-sm">Accede a +100 oraciones guiadas</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  // Default 'card' variant (Dashboard style)
  return (
    <div className={`bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-5 sm:p-6 relative overflow-hidden ${className}`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3 className="text-lg sm:text-xl font-bold text-yellow-900">{title}</h3>
            </div>
            <p className="text-sm sm:text-base text-yellow-900/90 mb-4">
              {description}
            </p>
          </div>
        </div>
        <button
          onClick={handleClick}
          className="bg-yellow-900 hover:bg-yellow-950 text-yellow-50 font-bold py-3 px-6 rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg"
        >
          {buttonText}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
