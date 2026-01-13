'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CountrySelect from '@/components/CountrySelect';
import { register } from '@/lib/auth';
import { countries } from '@/lib/countries';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    pais: '',
    whatsapp: '',
    phonePrefix: '+54', // Default
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-set prefix when country is selected
  useEffect(() => {
    if (formData.pais) {
      const country = countries.find(c => c.name === formData.pais);
      if (country && country.prefix) {
        setFormData(prev => ({ ...prev, phonePrefix: country.prefix }));
      }
    }
  }, [formData.pais]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = ['El nombre debe tener al menos 2 caracteres'];
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = ['El email es requerido y debe ser válido'];
    }

    if (!formData.pais) {
      newErrors.pais = ['Debes seleccionar un país'];
    }

    if (formData.whatsapp) {
      const cleanNumber = formData.whatsapp.replace(/\D/g, '');
      if (cleanNumber.length < 8 || cleanNumber.length > 15) {
        newErrors.whatsapp = ['El número de teléfono debe tener entre 8 y 15 dígitos'];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError('');
    setSuccess(false);

    if (!validateForm()) {
      setLoading(false);
      setGeneralError('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    // Combine prefix and number for the backend
    const submissionData = {
      nombre: formData.nombre,
      email: formData.email,
      pais: formData.pais,
      whatsapp: formData.whatsapp ? `${formData.phonePrefix}${formData.whatsapp}` : '',
    };

    try {
      const data = await register(submissionData);

      if (data.success) {
        setSuccess(true);
        router.push('/encuesta');
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.errors && Object.keys(error.errors).length > 0) {
        setErrors(error.errors);
      }
      if (error.message) {
        setGeneralError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div style={{"height": "70vh"}} className="bg-gray-900 p-5 sm:p-4 md:p-6 rounded-2xl w-full max-w-xl overflow-y-auto">
        <h1 className="text-xl max-h-[600px]:text-lg sm:text-2xl md:text-3xl font-bold text-white mb-5 max-h-[600px]:mb-3 sm:mb-5">
          Registro
        </h1>

        <div className="mb-5 max-h-[600px]:mb-3 sm:mb-5 md:mb-6 p-2 max-h-[600px]:p-2 sm:p-3 md:p-4 bg-gray-800 border border-gray-700 rounded-xl">
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-words">
            <strong>Nota:</strong> Próximamente implementaremos autenticación con código OTP por email (sin contraseña).
          </p>
        </div>

        {success && (
          <div className="mb-4 max-h-[600px]:mb-2 sm:mb-6 p-3 max-h-[600px]:p-2 sm:p-4 bg-green-900 text-green-300 rounded-xl text-center font-medium text-sm sm:text-base">
            ¡Registro exitoso!
          </div>
        )}

        {generalError && (
          <div className="mb-4 max-h-[600px]:mb-2 sm:mb-6 p-3 max-h-[600px]:p-2 sm:p-4 bg-red-900 border border-red-800 text-red-300 rounded-xl text-sm sm:text-base">
            <strong>Error:</strong> {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5 max-h-[600px]:mb-3 sm:mb-5 md:mb-6">
            <label htmlFor="nombre" className="block text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2 max-h-[600px]:mb-1 sm:mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 max-h-[600px]:py-2 sm:py-3 md:px-4 md:py-4 text-sm sm:text-sm md:text-base text-white bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder:text-gray-500"
              placeholder="Tu nombre completo"
              required
              minLength={2}
              maxLength={255}
            />
            {errors.nombre && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.nombre[0]}</p>
            )}
          </div>

          <div className="mb-5 max-h-[600px]:mb-3 sm:mb-5 md:mb-6">
            <label htmlFor="email" className="block text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2 max-h-[600px]:mb-1 sm:mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 max-h-[600px]:py-2 sm:py-3 md:px-4 md:py-4 text-sm sm:text-sm md:text-base text-white bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder:text-gray-500"
              placeholder="tucorreo@ejemplo.com"
              required
              maxLength={255}
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div className="mb-5 max-h-[600px]:mb-3 sm:mb-5 md:mb-6">
            <label className="block text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2 max-h-[600px]:mb-1 sm:mb-2">
              País
            </label>
            <CountrySelect
              value={formData.pais}
              onChange={(value) => setFormData({ ...formData, pais: value })}
              error={errors.pais?.[0]}
            />
          </div>

          <div className="mb-6 max-h-[600px]:mb-4 sm:mb-6 md:mb-8">
            <label htmlFor="whatsapp" className="block text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2 max-h-[600px]:mb-1 sm:mb-2">
              WhatsApp <span className="text-gray-500 text-xs">(opcional)</span>
            </label>
            <div className="flex">
              <div
                className="w-[80px] sm:w-[100px] px-2 py-2 max-h-[600px]:py-2 sm:py-3 md:px-4 md:py-4 text-sm sm:text-sm md:text-base text-gray-300 bg-gray-700 border border-gray-700 rounded-l-xl border-r-0 flex items-center justify-center font-medium select-none"
              >
                {formData.phonePrefix}
              </div>
              <input
                type="text"
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, whatsapp: val });
                }}
                className="flex-1 px-3 py-2 max-h-[600px]:py-2 sm:py-3 md:px-4 md:py-4 text-sm sm:text-sm md:text-base text-white bg-gray-800 border border-gray-700 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:z-10 placeholder:text-gray-500"
                placeholder="1234567890"
                maxLength={15}
              />
            </div>
            {errors.whatsapp && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.whatsapp[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-2.5 max-h-[600px]:py-2 sm:py-3 md:py-4 px-4 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg font-bold rounded-xl hover:bg-yellow-400 active:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

