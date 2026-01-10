'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth, logout as authLogout, apiRequest } from '@/lib/auth';

interface Encuesta {
  id: number;
  pregunta: string;
  created_at: string;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  pais: string;
}

interface Question {
  id: string;
  pregunta: string;
  tipo: 'text' | 'textarea' | 'multiple_choice' | 'select' | 'radio';
  opciones?: string[];
  requerida: boolean;
}

// Questions configuration - Grouped by progress steps
const questions: Question[] = [
  // Step 1 (25% progress) - Vida de oración
  {
    id: 'vida_oracion',
    pregunta: '¿Cómo describirías tu vida de oración actualmente?',
    tipo: 'textarea',
    requerida: true,
  },
  {
    id: 'frecuencia_oracion',
    pregunta: '¿Con qué frecuencia sueles orar?',
    tipo: 'radio',
    opciones: ['Varias veces al día', 'Diariamente', 'Varias veces por semana', 'Ocasionalmente', 'Raramente'],
    requerida: true,
  },

  // Step 2 (50% progress) - Necesidades espirituales
  {
    id: 'temas_oracion',
    pregunta: '¿Sobre qué temas te gustaría orar con más frecuencia? (selecciona todos los que apliquen)',
    tipo: 'multiple_choice',
    opciones: ['Salud y sanación', 'Familia', 'Trabajo y finanzas', 'Paz interior', 'Guía espiritual', 'Perdón y reconciliación', 'Gratitud'],
    requerida: true,
  },
  {
    id: 'momento_oracion',
    pregunta: '¿En qué momento del día prefieres orar?',
    tipo: 'select',
    opciones: ['Al despertar (mañana)', 'Durante el día', 'Al anochecer', 'Antes de dormir (noche)', 'No tengo un momento fijo'],
    requerida: true,
  },

  // Step 3 (75% progress) - Servicio con IA
  {
    id: 'comodidad_ia',
    pregunta: '¿Qué tan cómodo te sientes usando inteligencia artificial como apoyo en tu vida de oración?',
    tipo: 'radio',
    opciones: ['Muy cómodo', 'Cómodo', 'Neutral', 'Algo incómodo', 'Muy incómodo'],
    requerida: true,
  },
  {
    id: 'expectativas_servicio',
    pregunta: '¿Qué esperas de un servicio de oración con IA?',
    tipo: 'textarea',
    requerida: false,
  },

  // Step 4 (100% progress) - Características deseadas
  {
    id: 'funcionalidades_deseadas',
    pregunta: '¿Qué funcionalidades te gustaría que incluyera nuestro servicio? (selecciona todas las que apliquen)',
    tipo: 'multiple_choice',
    opciones: ['Oraciones personalizadas', 'Recordatorios diarios', 'Reflexiones bíblicas', 'Comunidad de oración', 'Seguimiento de intenciones', 'Meditación guiada'],
    requerida: false,
  },
  {
    id: 'aspecto_importante',
    pregunta: '¿Qué aspecto es más importante para ti en un servicio de oración?',
    tipo: 'radio',
    opciones: ['Privacidad y confidencialidad', 'Personalización', 'Facilidad de uso', 'Contenido bíblico', 'Accesibilidad 24/7'],
    requerida: true,
  },
];

// Define progress steps (4 steps with 2 questions each)
const QUESTIONS_PER_STEP = 2;
const TOTAL_STEPS = 4;

export default function EncuestaPage() {
  const router = useRouter();
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

  // Calculate current step and get questions for this step
  const currentStep = Math.floor(currentQuestionIndex / QUESTIONS_PER_STEP) + 1;
  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  // Get all questions for the current step
  const stepStartIndex = (currentStep - 1) * QUESTIONS_PER_STEP;
  const stepEndIndex = stepStartIndex + QUESTIONS_PER_STEP;
  const currentStepQuestions = questions.slice(stepStartIndex, stepEndIndex);

  // Check if all required questions in current step are answered
  const canProceed = currentStepQuestions.every(q =>
    !q.requerida || (answers[q.id] !== undefined && answers[q.id] !== '' && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true))
  );

  const isLastStep = currentStep === TOTAL_STEPS;

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
      const response = await apiRequest('/encuestas', {
        method: 'GET',
      });

      if (response.status === 401) {
        router.push('/register');
        return;
      }

      const data = await response.json();

      if (response.ok && data.data && data.data.length > 0) {
        setEncuesta(data.data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
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

  const handleNext = () => {
    setDropdownOpen({});
    if (isLastStep) {
      handleSubmitRespuesta();
    } else {
      // Move to next step (skip QUESTIONS_PER_STEP questions)
      setCurrentQuestionIndex(currentQuestionIndex + QUESTIONS_PER_STEP);
    }
  };

  const handleBack = () => {
    setDropdownOpen({});
    if (currentStep > 1) {
      // Move to previous step
      setCurrentQuestionIndex(currentQuestionIndex - QUESTIONS_PER_STEP);
    } else {
      handleLogout();
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleSubmitRespuesta = async () => {
    if (!encuesta) return;

    setSubmitting(true);

    try {
      const response = await apiRequest('/respuestas', {
        method: 'POST',
        body: JSON.stringify({
          encuesta_id: encuesta.id,
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
    const value = answers[question.id];

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
        const isOpen = dropdownOpen[question.id] || false;
        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen({ ...dropdownOpen, [question.id]: !isOpen })}
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
                  onClick={() => setDropdownOpen({ ...dropdownOpen, [question.id]: false })}
                />
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto hide-scrollbar">
                  {question.opciones?.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => {
                        handleAnswerChange(question.id, opcion);
                        setDropdownOpen({ ...dropdownOpen, [question.id]: false });
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
          <div className="space-y-2 sm:space-y-3">
            {question.opciones?.map((opcion) => (
              <label
                key={opcion}
                className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opcion}
                  checked={value === opcion}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 focus:ring-indigo-500 flex-shrink-0"
                />
                <span className="text-sm sm:text-base text-gray-700 leading-snug">{opcion}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple_choice':
        const selectedValues = value || [];
        return (
          <div className="space-y-2 sm:space-y-3">
            {question.opciones?.map((opcion) => (
              <label
                key={opcion}
                className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
              >
                <input
                  type="checkbox"
                  value={opcion}
                  checked={selectedValues.includes(opcion)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleAnswerChange(question.id, [...selectedValues, opcion]);
                    } else {
                      handleAnswerChange(question.id, selectedValues.filter((v: string) => v !== opcion));
                    }
                  }}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 rounded focus:ring-indigo-500 flex-shrink-0"
                />
                <span className="text-sm sm:text-base text-gray-700 leading-snug">{opcion}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 max-h-[600px]:py-2 sm:px-4 sm:py-3 md:p-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 max-h-[600px]:w-6 max-h-[600px]:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 max-h-[600px]:w-3.5 max-h-[600px]:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-indigo-500 font-semibold tracking-wider text-xs max-h-[600px]:text-xs sm:text-sm md:text-base">ORAS</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loadingLogout}
          className="text-gray-400 text-[10px] max-h-[600px]:text-[10px] sm:text-xs md:text-sm"
        >
          {loadingLogout ? 'Cerrando...' : 'Salir'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-2 max-h-[600px]:px-3 max-h-[600px]:py-2 sm:px-4 sm:py-4 md:px-6 md:py-8 max-w-2xl mx-auto w-full overflow-y-auto">
        {!encuesta ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-2">No hay encuestas disponibles</p>
            <p className="text-gray-500 text-sm">Las encuestas aparecerán aquí cuando estén disponibles</p>
          </div>
        ) : submitted ? (
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
                  <span className="text-[10px] max-h-[600px]:text-[10px] sm:text-xs md:text-sm text-gray-500">
                    Paso {currentStep} de {TOTAL_STEPS}
                  </span>
                  <span className="text-[10px] max-h-[600px]:text-[10px] sm:text-xs md:text-sm font-medium text-indigo-500">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 max-h-[600px]:h-1 sm:h-1.5 md:h-2">
                  <div
                    className="bg-indigo-500 h-1 max-h-[600px]:h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Multiple Questions */}
              <div className="space-y-4 max-h-[600px]:space-y-3 sm:space-y-6 md:space-y-8">
                {currentStepQuestions.map((question, index) => (
                  <div key={question.id}>
                    <h2 className="text-base max-h-[600px]:text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 max-h-[600px]:mb-2 sm:mb-3 md:mb-4 leading-tight">
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
                className="flex-1 bg-white text-gray-600 py-2 max-h-[600px]:py-2 sm:py-3 md:py-4 px-3 max-h-[600px]:px-3 sm:px-4 md:px-6 text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-medium rounded-xl border border-gray-300 active:bg-gray-50"
              >
                {currentStep === 1 ? 'Salir' : 'Atrás'}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting || !canProceed}
                className="flex-1 bg-indigo-500 text-white py-2 max-h-[600px]:py-2 sm:py-3 md:py-4 px-3 max-h-[600px]:px-3 sm:px-4 md:px-6 text-xs max-h-[600px]:text-xs sm:text-sm md:text-base font-semibold rounded-xl active:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
