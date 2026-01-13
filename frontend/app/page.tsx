'use client';

import RegisterForm from '@/components/RegisterForm';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div style={{"height": "70vh"}} className="bg-gray-900 p-5 sm:p-4 md:p-6 rounded-2xl w-full max-w-xl overflow-y-auto">
        <h1 className="text-xl max-h-[600px]:text-lg sm:text-2xl md:text-3xl font-bold text-white mb-5 max-h-[600px]:mb-3 sm:mb-5">
          Registro
        </h1>

        <RegisterForm />
      </div>
    </div>
  );
}
