# Guía de Integración: Auto-Save en Encuesta

## ✅ Archivos Base Creados

### 1. Configuración y Tipos
- `lib/encuesta-config.ts` - Constantes (TOTAL_PASOS, AUTOSAVE_DELAY_MS, etc.)
- `lib/encuesta-types.ts` - Tipos TypeScript (EncuestaProgreso, Payloads, etc.)

### 2. Hooks
- `hooks/useDebounce.ts` - Hook genérico de debounce
- `hooks/useEncuestaAutoSave.ts` - Hook principal de auto-save

---

## 📋 Cómo Integrar en `app/encuesta/page.tsx`

### Paso 1: Importar dependencias

```typescript
// Agregar al inicio del archivo
import { useEncuestaAutoSave } from '@/hooks/useEncuestaAutoSave';
import { ENCUESTA_CONFIG } from '@/lib/encuesta-config';
import type { PreguntaId } from '@/lib/encuesta-types';
```

### Paso 2: Agregar estado de "último guardado"

```typescript
// Dentro del componente EncuestaPage, después de const [answers, setAnswers] = ...
const [lastSavedAnswers, setLastSavedAnswers] = useState<Record<string, any>>({});
```

### Paso 3: Inicializar el hook de auto-save

```typescript
// Después de los estados
const { isSaving, saveImmediately, debouncedSave } = useEncuestaAutoSave({
  currentStep,
  currentAnswers: answers,
  lastSavedAnswers: lastSavedAnswers,
  currentQuestionId: currentStepQuestions[0]?.id as PreguntaId,
  isSubmitted: submitted,
  onSaveSuccess: () => {
    setLastSavedAnswers(answers);
  },
  onSaveError: (error) => {
    console.error('Error auto-save:', error);
  },
});
```

### Paso 4: Modificar `handleAnswerChange`

```typescript
// Reemplazar la función actual
const handleAnswerChange = (questionId: string, value: any) => {
  const newAnswers = { ...answers, [questionId]: value };
  setAnswers(newAnswers);

  // ✅ Trigger auto-save con debounce de 3 segundos
  debouncedSave(newAnswers);
};
```

### Paso 5: Modificar `handleNext`

```typescript
// Reemplazar la función actual
const handleNext = async () => {
  setDropdownOpen({});

  // ✅ Guardar inmediatamente antes de avanzar
  await saveImmediately(answers);

  if (isLastStep) {
    handleSubmitRespuesta();
  } else {
    setCurrentQuestionIndex(currentQuestionIndex + QUESTIONS_PER_STEP);
  }
};
```

### Paso 6: Agregar indicador visual de guardado (opcional)

```typescript
// En el header, después del botón "Salir"
{isSaving && (
  <div className="flex items-center gap-1 text-xs text-gray-400">
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
```

---

## 🔧 Cómo Funciona

### Auto-Save Automático (Debounce 3s)
1. Usuario escribe en un campo
2. Se llama `handleAnswerChange`
3. Hook espera 3 segundos de inactividad
4. Si no hay más cambios, guarda automáticamente

### Guardado Inmediato
1. Usuario hace clic en "Siguiente"
2. Se llama `handleNext`
3. Cancela el debounce pendiente
4. Guarda inmediatamente con `saveImmediately`
5. Avanza al siguiente paso

### Guardado en Eventos de Página
El hook escucha automáticamente:
- **visibilitychange**: Usuario cambia de tab/app
- **pagehide**: Usuario cierra la página
- **beforeunload**: Fallback para Safari

Estos eventos usan `sendBeacon` (más confiable que `fetch`).

---

## 📊 Métricas que se Capturan

Cada vez que se guarda progreso, el backend registra:
- `paso_actual`: En qué paso está el usuario (1-4)
- `ultimo_paso_completado`: Último paso que envió (0-4)
- `ultima_pregunta_vista`: ID de la última pregunta vista
- `respuestas_parciales`: Todas las respuestas hasta el momento
- `estado`: 'en_progreso'
- `ultima_interaccion_at`: Timestamp actual

Esto permite en el admin:
- Ver cuántos abandonan en cada paso
- Identificar preguntas problemáticas
- Distinguir high intent (escribieron) vs low intent (no escribieron)

---

## ⚠️ Importante: Validaciones Backend

Asegurarse de implementar en `backend/app/Http/Controllers/EncuestaController.php`:

```php
public function guardarProgreso(Request $request)
{
    $validated = $request->validate([
        'paso_actual' => 'required|integer|min:1|max:4',
        'ultimo_paso_completado' => 'required|integer|min:0|max:4',
        'ultima_pregunta_vista' => 'required|string',
        'respuestas_parciales' => 'required|array',
        'estado' => 'required|string|in:sin_iniciar,en_progreso,completada,abandonada',
    ]);

    $progreso = EncuestaProgreso::updateOrCreate(
        ['people_id' => $request->user()->id],
        [
            ...$validated,
            'preguntas_respondidas' => array_keys($validated['respuestas_parciales']),
            'ultima_interaccion_at' => now(),
        ]
    );

    return response()->json(['success' => true, 'data' => $progreso]);
}
```

---

## 🧪 Testing

### Probar Auto-Save con Debounce
1. Abrir la encuesta
2. Escribir en un campo de texto
3. Esperar 3 segundos sin tocar nada
4. Ver en DevTools Network que se envía POST a `/api/encuesta/progreso`

### Probar Guardado Inmediato
1. Llenar un paso completo
2. Hacer clic en "Siguiente"
3. Ver en Network que se guarda inmediatamente (sin esperar 3s)

### Probar visibilitychange
1. Llenar algunos campos
2. Cambiar de tab en el navegador
3. Volver a la tab
4. Verificar en backend que se guardó

### Probar pagehide
1. Llenar algunos campos
2. Cerrar la tab/ventana
3. Reabrir la encuesta
4. Verificar que el progreso se restauró

---

## 📝 TODO: Próximos Pasos

1. **Integrar en page.tsx** (esperando señal del usuario)
2. **Implementar backend endpoints** (guardarProgreso, obtenerProgreso)
3. **Migrar BD** (`php artisan migrate`)
4. **Implementar analytics en admin** (visualización de drop-off)
5. **Testing en dispositivos reales** (mobile Android/iOS)

---

## 🔗 Referencias

- [React-admin AutoSave](https://marmelab.com/react-admin/AutoSave.html) - 3 segundos default
- [SpeedKit: Beacon Reliability](https://www.speedkit.com/blog/unload-beacon-reliability-benchmarking-strategies-for-minimal-data-loss) - 91% con visibilitychange + pagehide
- [CSS-Tricks: HTTP on Page Exit](https://css-tricks.com/send-an-http-request-on-page-exit/)
