'use client';

import RegisterForm from '@/components/RegisterForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-2 max-h-[600px]:p-2 sm:p-3 md:p-4">
      <div className="bg-white p-3 max-h-[600px]:p-3 sm:p-4 md:p-6 rounded-2xl shadow-sm w-full mt-2 max-h-[600px]:mt-1 sm:mt-3 md:mt-4">
        <h1 className="text-xl max-h-[600px]:text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 max-h-[600px]:mb-2 sm:mb-4">
          Registro
        </h1>

        <RegisterForm />
      </div>
    </div>
  );
}
