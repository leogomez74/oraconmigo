'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth as authCheck, logout as authLogout } from '@/lib/auth';
import DailyVerse from '@/components/DailyVerse';
import PremiumBanner from '@/components/PremiumBanner';

interface User {
  id: number;
  nombre: string;
  email: string;
  pais: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    checkAuth();
    updateTime();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authCheck();

      if (!userData) {
        router.push('/register');
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error('Error:', error);
      router.push('/register');
    } finally {
      setLoading(false);
    }
  };

  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    let greeting = '';

    if (hours < 12) {
      greeting = 'Buenos días';
    } else if (hours < 19) {
      greeting = 'Buenas tardes';
    } else {
      greeting = 'Buenas noches';
    }

    setCurrentTime(greeting);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);

    try {
      await authLogout();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      router.push('/register');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 py-3 sm:px-4 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-indigo-500 font-semibold tracking-wider text-sm sm:text-base">ORAS</span>
          </div>
          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm transition-colors"
          >
            {loadingLogout ? 'Cerrando...' : 'Salir'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        {/* Greeting */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">
            {currentTime}, {user?.nombre}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Tu espacio de oración personalizado
          </p>
        </div>

        {/* Daily Prayer Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Palabra del día</h2>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 sm:p-5">
             <DailyVerse />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Racha actual</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">1 día</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Oraciones</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">1</p>
          </div>
        </div>

        {/* Premium Banner */}
        <PremiumBanner className="mb-6 sm:mb-8" />

        {/* Quick Actions */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Acciones rápidas</h3>

          <button
            onClick={() => router.push('/oracion')}
            className="w-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl p-4 sm:p-5 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base">Oraciones Guiadas</p>
                <p className="text-xs sm:text-sm text-white/80">Encuentra  paz  y  fortaleza</p>
              </div>
            </div>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => router.push('/biblia')}
            className="w-full bg-white border border-gray-200 hover:border-indigo-500 hover:shadow-md text-gray-900 rounded-xl p-4 sm:p-5 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base">Leer la Biblia</p>
                <p className="text-xs sm:text-sm text-gray-500">Antiguo y Nuevo Testamento</p>
              </div>
            </div>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
