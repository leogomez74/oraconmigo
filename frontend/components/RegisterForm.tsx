'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CountrySelect from '@/components/CountrySelect';
import { register, getCsrfCookie } from '@/lib/auth';
import Link from 'next/link';
import { countries } from '@/lib/countries';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido:'',
    email: '',
    pais: '',
    whatsapp: '',
    phonePrefix: '', // Default
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Preload CSRF cookie when component mounts
  useEffect(() => {
    getCsrfCookie().catch(err => console.error('Error precargando CSRF:', err));
  }, []);

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
      apellido: formData.apellido,
      email: formData.email,
      pais: formData.pais,
      whatsapp: formData.whatsapp ? `${formData.phonePrefix}${formData.whatsapp}` : '',
    };

    try {
      const data = await register(submissionData);

      if (data.success) {
        setSuccess(true);
        try {
          sessionStorage.setItem('oc_show_thankyou', '1');
        } catch {
          // ignore
        }
        router.push('/encuesta');
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      const err = error as { errors?: Record<string, string[]>; message?: string };
      if (err.errors && Object.keys(err.errors).length > 0) {
        setErrors(err.errors);
      }
      if (err.message) {
        setGeneralError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] sm:min-h-0">
      <div className="mx-auto w-full max-w-xl px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+16px)] sm:px-0 sm:pt-0 sm:pb-0">
        <h1 className="mb-4 text-center text-sm sm:text-base font-bold text-black">
          No compartimos tus datos con NADIE.
        </h1>

        {success && (
          <div className="mb-3 sm:mb-4 md:mb-5 p-3 sm:p-4 md:p-5 bg-green-100 text-green-800 rounded-xl text-center font-medium text-sm sm:text-base">
            ¡Registro exitoso!
          </div>
        )}

        {generalError && (
          <div className="mb-3 sm:mb-4 md:mb-5 p-3 sm:p-4 md:p-5 bg-red-100 border border-red-300 text-red-800 rounded-xl text-sm sm:text-base">
            <strong>Error:</strong> {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        <div>
          <label htmlFor="nombre" className="block text-xs sm:text-sm md:text-base font-medium text-black mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3 md:px-5 md:py-3.5 text-sm sm:text-base md:text-base text-black bg-blue-50 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            placeholder="Tu nombre completo"
            required
            minLength={2}
            maxLength={255}
          />
          {errors.nombre && (
            <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.nombre[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="apellido" className="block text-xs sm:text-sm md:text-base font-medium text-black mb-2">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3 md:px-5 md:py-3.5 text-sm sm:text-base md:text-base text-black bg-blue-50 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            placeholder="Tu apellido completo"
            required
            minLength={2}
            maxLength={255}
          />
          {errors.apellido && (
            <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.apellido[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm md:text-base font-medium text-black mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3 md:px-5 md:py-3.5 text-sm sm:text-base md:text-base text-black bg-blue-50 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            placeholder="tucorreo@ejemplo.com"
            required
            maxLength={255}
          />
          {errors.email && (
            <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm md:text-base font-medium text-black mb-2">
            País
          </label>
          <CountrySelect
            value={formData.pais}
            onChange={(value) => setFormData({ ...formData, pais: value })}
            error={errors.pais?.[0]}
          />
        </div>

        <div className="mb-7 max-h-[600px]:mb-5 sm:mb-8 md:mb-9">
          <label htmlFor="whatsapp" className="block text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-medium text-black mb-2.5 max-h-[600px]:mb-2 sm:mb-3 md:mb-3.5">
            whatsapp
          </label>
          <div className="flex">
            <div
              className="w-[85px] sm:w-[105px] px-3 py-2.5 sm:px-4 sm:py-3 md:px-4 md:py-3.5 text-sm sm:text-base md:text-base text-black bg-blue-100 border border-blue-300 rounded-l-xl border-r-0 flex items-center justify-center font-medium select-none"
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
              className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 md:px-5 md:py-3.5 text-sm sm:text-base md:text-base text-black bg-blue-50 border border-blue-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 placeholder:text-gray-400"
              placeholder="1234567890"
              maxLength={15}
            />
          </div>
          {errors.whatsapp && (
            <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.whatsapp[0]}</p>
          )}
        </div>

          <div className="sticky bottom-0 -mx-4 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] bg-white/95 backdrop-blur border-t border-gray-200 sm:static sm:mx-0 sm:px-0 sm:pt-0 sm:pb-0 sm:bg-transparent sm:border-0">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 sm:py-3.5 md:py-4 px-5 sm:px-6 md:px-6 text-sm sm:text-base md:text-lg font-bold rounded-xl hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
        <div className="flex items-start gap-2 mt-4 text-sm text-gray-600">
          <input 
            type="checkbox" 
            id="terms"
            name="acepta_terminos"
            required
            className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="terms">
            Acepto los{' '}
            <Link 
              href="/privacidad?tab=generales" 
              target="_blank"
              className="text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              Términos Generales
            </Link>
            {' '}y las{' '}
            <Link 
              href="/privacidad?tab=privacidad" 
              target="_blank"
              className="text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              Políticas de Privacidad
            </Link>
            {' '}de Oraconmigo.
          </label>
        </div>
      </div>
    </div>
  );
}
