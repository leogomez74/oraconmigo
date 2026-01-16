'use client';

import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6">
      <div style={{"height": "90vh"}} className="bg-white p-6 max-h-[600px]:p-4 sm:p-7 md:p-8 rounded-2xl w-full max-w-xl overflow-y-auto">
        <h1 className="text-xl max-h-[600px]:text-lg sm:text-2xl md:text-3xl font-bold text-black mb-6 max-h-[600px]:mb-4 sm:mb-7 md:mb-8">
          Registro
        </h1>

        <RegisterForm />
      </div>
    </div>
  );
}
