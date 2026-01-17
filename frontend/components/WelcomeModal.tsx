'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Background image */}
      <Image
        src="/images/002.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-8 pt-10 sm:justify-center sm:px-10">
        <div className="w-full max-w-xl">
          <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-4 border border-white/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-3 mb-6 border border-white/15">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
              ¿Te gustaría recibir{' '}
              <span className="text-[#FFCC00]">otros dos meses</span> gratis de Ora Conmigo Premium?
            </h2>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed text-center">
              Ayudanos a responder unas preguntas en 3 minutos y gana dos meses gratis de premium.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push('/');
              }}
              className="w-1/2 bg-[#CCCCCC] hover:bg-[#BFBFBF] active:bg-[#B3B3B3] text-white font-bold py-3.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-black"
            >
              no quiero
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              si quiero
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
