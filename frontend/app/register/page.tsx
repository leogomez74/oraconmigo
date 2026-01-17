'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showForm) return;

    const id = requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => cancelAnimationFrame(id);
  }, [showForm]);

  return (
    <div className="min-h-[100dvh] bg-white sm:flex sm:items-center sm:justify-center sm:px-4">
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl sm:p-5 md:p-6">
        {!showForm ? (
          <div>
            <div className="relative w-full overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border sm:border-blue-200 bg-blue-50 h-[100dvh] sm:h-[560px]">
              <Image
                src="/images/001.jpeg"
                alt="Portada"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-3 mb-3 sm:mb-4 border border-white/15">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
                    ¿Te gustaría un mes de Ora Conmigo Premium{' '}
                    <span className="text-[#FFCC00]">totalmente gratis</span>?
                  </h2>
                  <p className="text-white/85 text-sm sm:text-base leading-relaxed text-center">
                    Ora Conmigo AI es un app de acompañamiento espiritual potenciado con Inteligencia Artificial
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-5 sm:px-6 text-sm sm:text-base md:text-lg font-bold rounded-xl hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black/30 transition-all duration-200"
                >
                  Quiero registrarme
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div ref={formRef}>
            <RegisterForm />
          </div>
        )}
      </div>
    </div>
  );
}
