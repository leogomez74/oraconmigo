'use client';

import Image from 'next/image';

interface ThankYouCoverProps {
  isOpen: boolean;
}

export default function ThankYouCover({ isOpen }: ThankYouCoverProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <Image
        src="/images/003.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-8 pt-10 sm:justify-center sm:px-10">
        <div className="w-full max-w-xl">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/15">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
              ¡MUCHAS GRACIAS por registrarte!
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed text-center">
              Dios te bendiga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
