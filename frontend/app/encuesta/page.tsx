'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth, logout as authLogout, apiRequest } from '@/lib/auth';
import LoadingSpinner from '@/components/LoadingSpinner';
import WelcomeModal from '@/components/WelcomeModal';
import { useEncuestaAutoSave } from '@/hooks/useEncuestaAutoSave';
import type { PreguntaId } from '@/lib/encuesta-types';
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  subsets: ['latin'],
  weight: '400',
});

// 1. INTERFAZ ACTUALIZADA (Acepta string o number para ID)
interface Question {
  id: string | number; 
  pregunta: string;
  tipo: 'text' | 'textarea' | 'multiple_choice' | 'select' | 'radio';
  opciones?: string[];
  requerida: boolean;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  pais: string;
}

// 2. MOCK DATA (Tus preguntas de respaldo)
const MOCK_QUESTIONS: Question[] = [
  // Step 1
  {
    id: 'tiempo_diario',
    pregunta: '¿Cuánto tiempo quieres dedicarle a tu vida de oración cada día?',
    tipo: 'radio',
    opciones: ['5 minutos al día', '10 minutos al día', '15 minutos al día', '30+ minutos al día'],
    requerida: true,
  },
  {
    id: 'momento_preferido',
    pregunta: '¿En qué momento del día prefieres orar?',
    tipo: 'radio',
    opciones: ['Por la mañana al despertar', 'Durante el día (mediodía)', 'Por la tarde', 'Por la noche antes de dormir', 'Cualquier momento'],
    requerida: true,
  },
  // Step 2
  {
    id: 'area_mejorar',
    pregunta: '¿Qué área te gustaría mejorar primero? (Selecciona todas las que apliquen)',
    tipo: 'multiple_choice',
    opciones: ['Reducir el estrés', 'Disminuir la ansiedad', 'Mejorar el ánimo', 'Dormir mejor', 'Crecer espiritualmente', 'Encontrar sentido y propósito'],
    requerida: true,
  },
  {
    id: 'nivel_estres',
    pregunta: '¿Cómo describirías tu nivel de estrés actualmente?',
    tipo: 'radio',
    opciones: ['Muy alto', 'Alto', 'Moderado', 'Bajo', 'Muy bajo'],
    requerida: true,
  },
  // Step 3
  {
    id: 'experiencia_oracion',
    pregunta: '¿Cuál es tu experiencia con la oración?',
    tipo: 'radio',
    opciones: ['Soy nuevo en esto', 'He orado algunas veces', 'Oro ocasionalmente', 'Oro regularmente', 'Oro diariamente'],
    requerida: true,
  },
  {
    id: 'temas_oracion',
    pregunta: '¿Sobre qué temas te gustaría orar? (Selecciona todos los que quieras)',
    tipo: 'multiple_choice',
    opciones: ['Salud y sanación', 'Familia y relaciones', 'Trabajo y finanzas', 'Paz interior', 'Guía y dirección', 'Gratitud', 'Perdón', 'Fortaleza'],
    requerida: true,
  },
  // Step 4
  {
    id: 'denominacion',
    pregunta: '¿Con qué denominación cristiana te identificas?',
    tipo: 'radio',
    opciones: ['Católico', 'Protestante/Evangélico', 'Ortodoxo', 'Pentecostal', 'Bautista', 'Adventista', 'Otra', 'Prefiero no decir'],
    requerida: false,
  },
  {
    id: 'asistencia_iglesia',
    pregunta: '¿Con qué frecuencia asistes a una iglesia o comunidad de fe?',
    tipo: 'radio',
    opciones: ['Varias veces por semana', 'Una vez por semana', 'Una o dos veces al mes', 'Ocasionalmente', 'Casi nunca', 'Nunca'],
    requerida: false,
  },
  // Step 5
  {
    id: 'lectura_biblia',
    pregunta: '¿Con qué frecuencia lees la Biblia?',
    tipo: 'radio',
    opciones: ['Diariamente', 'Varias veces por semana', 'Una vez por semana', 'Ocasionalmente', 'Casi nunca', 'Nunca'],
    requerida: false,
  },
  {
    id: 'conocimiento_biblico',
    pregunta: '¿Cómo describirías tu conocimiento de la Biblia?',
    tipo: 'radio',
    opciones: ['Principiante (recién empiezo)', 'Básico (conozco algunas historias)', 'Intermedio (he leído varias partes)', 'Avanzado (la he leído completa)', 'Experto (la estudio profundamente)'],
    requerida: false,
  },
  // Step 6
  {
    id: 'sistema_apoyo',
    pregunta: '¿Cuántas personas pueden apoyarte en momentos difíciles?',
    tipo: 'radio',
    opciones: ['3 o más', '2 personas', '1 persona', 'Solo yo'],
    requerida: true,
  },
  {
    id: 'estado_civil',
    pregunta: '¿Cuál es tu estado civil?',
    tipo: 'radio',
    opciones: ['Soltero/a', 'En una relación', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Prefiero no decir'],
    requerida: false,
  },
  // Step 7
  {
    id: 'tiene_hijos',
    pregunta: '¿Tienes hijos?',
    tipo: 'radio',
    opciones: ['Sí, menores de edad', 'Sí, mayores de edad', 'Sí, de ambas edades', 'No tengo hijos', 'Prefiero no decir'],
    requerida: false,
  },
  {
    id: 'genero',
    pregunta: '¿Cuál es tu género? (Esto nos ayuda a personalizar el contenido)',
    tipo: 'radio',
    opciones: ['Hombre', 'Mujer', 'Prefiero no decir'],
    requerida: false,
  },
  // Step 8
  {
    id: 'grupo_edad',
    pregunta: '¿Cuál es tu grupo de edad?',
    tipo: 'radio',
    opciones: ['13-17', '18-24', '25-34', '35-44', '45-54', '55+', 'Prefiero no decir'],
    requerida: false,
  },
  {
    id: 'formato_preferido',
    pregunta: '¿Qué formato de contenido prefieres?',
    tipo: 'multiple_choice',
    opciones: ['Audio guiado', 'Texto para leer', 'Video', 'Música de fondo', 'Imágenes inspiradoras', 'Cualquiera'],
    requerida: true,
  },
  // Step 9
  {
    id: 'recordatorios',
    pregunta: '¿Te gustaría recibir recordatorios diarios para orar?',
    tipo: 'radio',
    opciones: ['Sí, activar ahora', 'Tal vez después', 'No, gracias'],
    requerida: true,
  },
  {
    id: 'frecuencia_recordatorios',
    pregunta: 'Si activas recordatorios, ¿cuántos por día prefieres?',
    tipo: 'radio',
    opciones: ['1 vez al día', '2 veces al día', '3 veces al día', 'Solo cuando yo decida'],
    requerida: false,
  },
  // Step 10
  {
    id: 'funcionalidades_deseadas',
    pregunta: '¿Qué funcionalidades te gustaría que incluyera nuestro servicio? (Selecciona todas)',
    tipo: 'multiple_choice',
    opciones: ['Oraciones programadas (mañana, mediodía, noche)', 'Biblia en un año', 'Audio para dormir', 'Contenido en video', 'Reflexiones diarias', 'Comunidad de oración', 'Rastreo de progreso', 'Versículos diarios'],
    requerida: false,
  },
  {
    id: 'experiencia_premium',
    pregunta: '¿Te interesaría una experiencia sin anuncios y con contenido exclusivo?',
    tipo: 'radio',
    opciones: ['Sí, me interesa', 'Tal vez', 'No, prefiero la versión gratuita'],
    requerida: true,
  },
  {
    id: 'interes_donacion',
    pregunta: '¿Te gustaría ayudar con una donación?',
    tipo: 'radio',
    opciones: ['Sí, me gustaría donar', 'No, por ahora', 'Tal vez más adelante'],
    requerida: true,
  },
];

export default function EncuestaPage() {
  const router = useRouter();
  
  // Estados de datos
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  // Estados de UI y Carga
  const [loading, setLoading] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Estados de Lógica de Encuesta
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [lastSavedAnswers, setLastSavedAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

  // Constantes de configuración
  const QUESTIONS_PER_STEP = 1;
  const TOTAL_STEPS = questionsList.length;

  // Cálculos de progreso
  const currentStep = Math.floor(currentQuestionIndex / QUESTIONS_PER_STEP) + 1;
  const progressPercentage = TOTAL_STEPS > 0 ? (currentStep / TOTAL_STEPS) * 100 : 0;

  // Obtener preguntas actuales
  const stepStartIndex = (currentStep - 1) * QUESTIONS_PER_STEP;
  const stepEndIndex = stepStartIndex + QUESTIONS_PER_STEP;
  const currentStepQuestions = questionsList.slice(stepStartIndex, stepEndIndex);

  // Hook de Auto-Save
  const { isSaving, debouncedSave } = useEncuestaAutoSave({
    currentStep,
    currentAnswers: answers,
    lastSavedAnswers: lastSavedAnswers,
    currentQuestionId: (currentStepQuestions[0] ? String(currentStepQuestions[0].id) : 'loading') as PreguntaId,
    isSubmitted: submitted,
    onSaveSuccess: () => {
      setLastSavedAnswers(answers);
    },
    onSaveError: (error) => {
      console.error('Error auto-save:', error);
    },
  });

  // Validación para avanzar
  const canProceed = currentStepQuestions.every(q => {
    const answer = answers[String(q.id)];
    if (!q.requerida) return true;
    return answer !== undefined && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true);
  });

  const isLastStep = currentStep === TOTAL_STEPS && TOTAL_STEPS > 0;

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  const checkAuthAndFetch = async () => {
    try {
      const userData = await checkAuth();

      if (!userData) {
        router.push('/register');
        return;
      }

      setUser(userData);
      await fetchEncuesta();
    } catch (error) {
      console.error('Error:', error);
      router.push('/register');
    } finally {
      setLoading(false);
    }
  };

  const fetchEncuesta = async () => {
    try {
      const response = await apiRequest('/api/encuestas', {
        method: 'GET',
      });

      if (response.status === 401) {
        router.push('/register');
        return;
      }

      const data = await response.json();

      // 3. LÓGICA DE FALLBACK: Si hay datos, úsalos. Si no, usa el Mock.
      if (response.ok && data.data && Array.isArray(data.data) && data.data.length > 0) {
        console.log("Cargando encuesta desde base de datos...");
        setQuestionsList(data.data);
      } else {
        console.warn("No se encontraron encuestas en DB o formato incorrecto. Usando MOCK DATA.");
        setQuestionsList(MOCK_QUESTIONS);
      }
    } catch (error) {
      console.error('Error fetching encuesta, usando fallback:', error);
      // En caso de error de red, también usamos el Mock
      setQuestionsList(MOCK_QUESTIONS);
    }
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

  const handleNext = async () => {
    setDropdownOpen({});
    await debouncedSave.debouncedCallback(answers);

    if (isLastStep) {
      handleSubmitRespuesta();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + QUESTIONS_PER_STEP);
    }
  };

  const handleBack = () => {
    setDropdownOpen({});
    if (currentStep > 1) {
      setCurrentQuestionIndex(currentQuestionIndex - QUESTIONS_PER_STEP);
    } else {
      handleLogout();
    }
  };

  const handleAnswerChange = (questionId: string | number, value: any) => {
    const newAnswers = {
      ...answers,
      [String(questionId)]: value,
    };
    setAnswers(newAnswers);
    debouncedSave.debouncedCallback(newAnswers);
  };

  const handleSubmitRespuesta = async () => {
    setSubmitting(true);
    try {
      const response = await apiRequest('/respuestas', {
        method: 'POST',
        body: JSON.stringify({
          respuestas: answers,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setAnswers({});
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const value = answers[String(question.id)];

    switch (question.tipo) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            rows={5}
            className="w-full px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Escribe tu respuesta aquí..."
          />
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Escribe tu respuesta..."
          />
        );

      case 'select':
        const isOpen = dropdownOpen[String(question.id)] || false;
        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen({ ...dropdownOpen, [String(question.id)]: !isOpen })}
              className={`w-full px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base text-left bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex items-center justify-between ${
                value ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              <span className="truncate pr-2">{value || 'Selecciona una opción...'}</span>
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen({ ...dropdownOpen, [String(question.id)]: false })}
                />
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto hide-scrollbar">
                  {question.opciones?.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => {
                        handleAnswerChange(question.id, opcion);
                        setDropdownOpen({ ...dropdownOpen, [String(question.id)]: false });
                      }}
                      className={`w-full px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base hover:bg-indigo-50 active:bg-indigo-100 transition-colors ${
                        value === opcion ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3 sm:space-y-4">
            {question.opciones?.map((opcion) => {
              const isSelected = value === opcion;
              return (
                <label
                  key={opcion}
                  className={`relative flex items-center p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-gray-900 border-2 border-yellow-500'
                      : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name={String(question.id)}
                    value={opcion}
                    checked={isSelected}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="sr-only"
                  />
                  <span className={`flex-1 text-base sm:text-lg font-normal ${
                    isSelected ? 'text-white' : 'text-gray-300'
                  }`}>
                    {opcion}
                  </span>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        );

      case 'multiple_choice':
        const selectedValues = value || [];
        return (
          <div className="space-y-3 sm:space-y-4">
            {question.opciones?.map((opcion) => {
              const isSelected = selectedValues.includes(opcion);
              return (
                <label
                  key={opcion}
                  className={`relative flex items-center p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-gray-900 border-2 border-yellow-500'
                      : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opcion}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleAnswerChange(question.id, [...selectedValues, opcion]);
                      } else {
                        handleAnswerChange(question.id, selectedValues.filter((v: string) => v !== opcion));
                      }
                    }}
                    className="sr-only"
                  />
                  <span className={`flex-1 text-base sm:text-lg font-normal ${
                    isSelected ? 'text-white' : 'text-gray-300'
                  }`}>
                    {opcion}
                  </span>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading || questionsList.length === 0) {
    return (
      <div className={prompt.className}>
         <LoadingSpinner message={loading ? "Verificando sesión..." : "Cargando encuesta..."} />
      </div>
    );
  }

  return (
    <div className={`${prompt.className} min-h-screen bg-black flex flex-col`}>
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 max-h-[600px]:py-2 sm:px-4 sm:py-3 md:p-4 bg-black">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 max-h-[600px]:w-6 max-h-[600px]:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-yellow-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 max-h-[600px]:w-3.5 max-h-[600px]:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-wider text-xs max-h-[600px]:text-xs sm:text-sm md:text-base">ORA</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Indicador de auto-save */}
          {isSaving && (
            <div className="flex items-center gap-1 text-[10px] max-h-[600px]:text-[10px] sm:text-xs text-gray-500">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Guardando...</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            className="text-gray-400 text-[10px] max-h-[600px]:text-[10px] sm:text-xs md:text-sm"
          >
            {loadingLogout ? 'Cerrando...' : 'Salir'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-2 max-h-[600px]:px-3 max-h-[600px]:py-2 sm:px-4 sm:py-4 md:px-6 md:py-8 max-w-2xl mx-auto w-full overflow-y-auto">
        {submitted ? (
          <div className="text-center py-8 sm:py-12">
            <div className="mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 px-4">¡Gracias por tu respuesta!</h2>
              <p className="text-gray-500 text-sm sm:text-base px-4 mb-6">Tu opinión ha sido registrada exitosamente.</p>

              <button
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-500 text-white py-3 px-8 rounded-xl font-semibold text-sm sm:text-base hover:bg-indigo-600 active:bg-indigo-700 transition-colors"
              >
                Ir al Dashboard
              </button>

              <p className="text-xs sm:text-sm text-gray-400 mt-4">
                Serás redirigido automáticamente en 3 segundos...
              </p>
            </div>
          </div>
        ) : currentStepQuestions.length > 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              {/* Progress indicator */}
              <div className="mb-3 max-h-[600px]:mb-2 sm:mb-5 md:mb-6">
                <div className="flex justify-between items-center mb-1 max-h-[600px]:mb-1 sm:mb-2">
                  <span className="text-[10px] max-h-[600px]:text-[10px] sm:text-xs md:text-sm text-gray-400">
                    Paso {currentStep} de {TOTAL_STEPS}
                  </span>
                  <span className="text-[10px] max-h-[600px]:text-[10px] sm:text-xs md:text-sm font-medium text-yellow-500">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1 max-h-[600px]:h-1 sm:h-1.5 md:h-2">
                  <div
                    className="bg-yellow-500 h-1 max-h-[600px]:h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Multiple Questions */}
              <div className="space-y-4 max-h-[600px]:space-y-3 sm:space-y-6 md:space-y-8">
                {currentStepQuestions.map((question) => (
                  <div key={question.id}>
                    <h2 className="text-base max-h-[600px]:text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 max-h-[600px]:mb-2 sm:mb-3 md:mb-4 leading-tight">
                      {question.pregunta}
                      {question.requerida && <span className="text-red-500 ml-1">*</span>}
                    </h2>
                    <div className="mb-1 max-h-[600px]:mb-1 sm:mb-2">
                      {renderQuestionInput(question)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex gap-2 sm:gap-3 mt-4 max-h-[600px]:mt-3 sm:mt-6 md:mt-8 pt-3 max-h-[600px]:pt-2 sm:pt-4 md:pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-gray-800 text-gray-300 py-3 max-h-[600px]:py-2 sm:py-3 md:py-4 px-3 max-h-[600px]:px-3 sm:px-4 md:px-6 text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-medium rounded-2xl border-2 border-gray-700 hover:bg-gray-700 active:bg-gray-600 transition-colors"
              >
                {currentStep === 1 ? 'Salir' : 'Atrás'}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting || !canProceed}
                className="flex-1 bg-yellow-500 text-black py-3 max-h-[600px]:py-2 sm:py-3 md:py-4 px-3 max-h-[600px]:px-3 sm:px-4 md:px-6 text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-bold rounded-2xl hover:bg-yellow-400 active:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Enviando...' : isLastStep ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}