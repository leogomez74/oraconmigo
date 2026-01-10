'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth as authCheck, logout as authLogout } from '@/lib/auth';
import LoadingSpinner from '@/components/LoadingSpinner';
import InicioTab from '@/components/tabs/InicioTab';
import BibliaTab from '@/components/tabs/BibliaTab';
import OracionesTab from '@/components/tabs/OracionesTab';

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
  const [activeTab, setActiveTab] = useState<'inicio' | 'biblia' | 'oraciones'>('inicio');

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
    return <LoadingSpinner message="Verificando acceso..." />;
  }

  // Si estamos en la pestaña Biblia, renderizamos una vista limpia sin el header global
  if (activeTab === 'biblia') {
    return (
      <div className="min-h-screen bg-gray-50">
        <BibliaTab onBack={() => setActiveTab('inicio')} />
      </div>
    );
  }

  // Si estamos en la pestaña Oraciones, renderizamos una vista limpia sin el header global
  if (activeTab === 'oraciones') {
    return (
      <div className="min-h-screen bg-gray-50">
        <OracionesTab onBack={() => setActiveTab('inicio')} />
      </div>
    );
  }

  // Vista por defecto (Inicio) con Header Global
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 py-3 sm:px-4 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo ORAS */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-indigo-500 font-semibold tracking-wider text-sm sm:text-base">
              ORAS
            </span>
          </div>

          {/* Botón logout */}
          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm transition-colors"
          >
            {loadingLogout ? 'Cerrando...' : 'Salir'}
          </button>
        </div>
      </div>

      <InicioTab
        user={user}
        currentTime={currentTime}
        onNavigateToBiblia={() => setActiveTab('biblia')}
        onNavigateToOracion={() => setActiveTab('oraciones')}
      />
    </div>
  );
}
