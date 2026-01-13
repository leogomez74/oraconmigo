# ✅ Resumen de Integración: Auto-Save Completo

## Cambios Realizados en `app/encuesta/page.tsx`

### 1. ✅ Imports Agregados (Líneas 7-8)
```typescript
import { useEncuestaAutoSave } from '@/hooks/useEncuestaAutoSave';
import type { PreguntaId } from '@/lib/encuesta-types';
```

### 2. ✅ Estado `lastSavedAnswers` Agregado (Línea 107)
```typescript
const [lastSavedAnswers, setLastSavedAnswers] = useState<Record<string, any>>({});
```

### 3. ✅ Hook `useEncuestaAutoSave` Inicializado (Líneas 122-135)
```typescript
const { isSaving, saveImmediately, debouncedSave } = useEncuestaAutoSave({
  currentStep,
  currentAnswers: answers,
  lastSavedAnswers: lastSavedAnswers,
  currentQuestionId: (currentStepQuestions[0]?.id || 'vida_oracion') as PreguntaId,
  isSubmitted: submitted,
  onSaveSuccess: () => {
    setLastSavedAnswers(answers);
  },
  onSaveError: (error) => {
    console.error('Error auto-save:', error);
  },
});
```

### 4. ✅ `handleNext` Modificado - Async + Save Inmediato (Líneas 209-221)
**Antes:**
```typescript
const handleNext = () => {
  setDropdownOpen({});
  if (isLastStep) {
    handleSubmitRespuesta();
  } else {
    setCurrentQuestionIndex(currentQuestionIndex + QUESTIONS_PER_STEP);
  }
};
```

**Después:**
```typescript
const handleNext = async () => {
  setDropdownOpen({});

  // ✅ Guardar progreso inmediatamente antes de avanzar
  await saveImmediately(answers);

  if (isLastStep) {
    handleSubmitRespuesta();
  } else {
    setCurrentQuestionIndex(currentQuestionIndex + QUESTIONS_PER_STEP);
  }
};
```

### 5. ✅ `handleAnswerChange` Modificado - Auto-save con Debounce (Líneas 233-242)
**Antes:**
```typescript
const handleAnswerChange = (questionId: string, value: any) => {
  setAnswers({
    ...answers,
    [questionId]: value,
  });
};
```

**Después:**
```typescript
const handleAnswerChange = (questionId: string, value: any) => {
  const newAnswers = {
    ...answers,
    [questionId]: value,
  };
  setAnswers(newAnswers);

  // ✅ Auto-save con debounce de 3 segundos
  debouncedSave(newAnswers);
};
```

### 6. ✅ Indicador Visual "Guardando..." Agregado (Líneas 416-438)
En el header, entre el logo y el botón "Salir":

```typescript
<div className="flex items-center gap-3">
  {/* ✅ Indicador de auto-save */}
  {isSaving && (
    <div className="flex items-center gap-1 text-[10px] max-h-[600px]:text-[10px] sm:text-xs text-gray-400">
      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
        {/* SVG spinner */}
      </svg>
      <span>Guardando...</span>
    </div>
  )}
  <button onClick={handleLogout} ...>
    {loadingLogout ? 'Cerrando...' : 'Salir'}
  </button>
</div>
```

---

## 🎯 Funcionalidades Implementadas

### A) Auto-Save Automático (Debounce 3s)
- **Trigger**: Usuario escribe en cualquier campo
- **Comportamiento**: Espera 3 segundos de inactividad antes de guardar
- **Optimización**: Solo guarda si hay cambios reales vs último guardado

### B) Guardado Inmediato
- **Trigger**: Usuario hace clic en "Siguiente"
- **Comportamiento**:
  1. Cancela el debounce pendiente
  2. Guarda inmediatamente
  3. Avanza al siguiente paso
- **Beneficio**: Garantiza que no se pierda progreso al avanzar

### C) Guardado en Eventos de Página (Automático)
El hook `useEncuestaAutoSave` escucha automáticamente:

1. **visibilitychange**: Usuario cambia de tab/app
2. **pagehide**: Usuario cierra la página
3. **beforeunload**: Fallback para Safari (bug conocido)

Usa `sendBeacon` (más confiable que `fetch` en eventos de cierre).

### D) Indicador Visual
- Muestra "Guardando..." con spinner animado
- Solo visible mientras se está guardando
- Diseño responsive (adapta tamaño según pantalla)

---

## 🔧 Cómo Funciona el Flujo

### Ejemplo 1: Usuario Escribe
```
Usuario escribe "Oro diariamente" en campo vida_oracion
  ↓
handleAnswerChange('vida_oracion', 'Oro diariamente')
  ↓
setAnswers({ vida_oracion: 'Oro diariamente' })
  ↓
debouncedSave({ vida_oracion: 'Oro diariamente' })
  ↓
[Espera 3 segundos...]
  ↓
POST /api/encuesta/progreso
  {
    paso_actual: 1,
    ultimo_paso_completado: 0,
    ultima_pregunta_vista: 'vida_oracion',
    respuestas_parciales: { vida_oracion: 'Oro diariamente' },
    estado: 'en_progreso'
  }
```

### Ejemplo 2: Usuario hace clic en "Siguiente"
```
Usuario hace clic en "Siguiente"
  ↓
handleNext()
  ↓
saveImmediately(answers)  // Cancela debounce, guarda inmediatamente
  ↓
POST /api/encuesta/progreso (sin esperar 3s)
  ↓
setCurrentQuestionIndex(currentQuestionIndex + 2)  // Avanza al paso 2
```

### Ejemplo 3: Usuario cambia de tab
```
Usuario cambia a otra tab del navegador
  ↓
Event: document.hidden = true
  ↓
useEncuestaAutoSave detecta visibilitychange
  ↓
navigator.sendBeacon('/api/encuesta/progreso', data)
  ↓
Datos guardados de forma confiable (91% success rate)
```

---

## 📊 Datos que se Envían al Backend

Cada vez que se guarda (automático o manual), se envía:

```typescript
{
  paso_actual: 1,              // En qué paso está (1-4)
  ultimo_paso_completado: 0,   // Último paso que envió (0-4)
  ultima_pregunta_vista: 'vida_oracion',  // ID de última pregunta
  respuestas_parciales: {      // Todas las respuestas hasta ahora
    vida_oracion: 'Oro diariamente',
    frecuencia_oracion: 'Diariamente'
  },
  estado: 'en_progreso'        // Estado actual
}
```

El backend registra además:
- `ultima_interaccion_at`: Timestamp actual
- `preguntas_respondidas`: Array de IDs de preguntas

---

## ⚠️ Pendiente para Completar

### 1. Backend Endpoint (CRÍTICO)
Implementar en `backend/app/Http/Controllers/EncuestaController.php`:

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

### 2. Migración de BD
```bash
cd backend
php artisan migrate
```

### 3. Testing
- Probar auto-save con debounce (escribir y esperar 3s)
- Probar guardado inmediato (clic en "Siguiente")
- Probar visibilitychange (cambiar de tab)
- Probar pagehide (cerrar página)

---

## 🎉 Estado Actual

✅ **Frontend completamente integrado**
- Imports agregados
- Estados configurados
- Hook inicializado
- Funciones modificadas
- UI con indicador visual

⏸️ **Pendiente:**
- Implementar backend endpoint `guardarProgreso()`
- Correr migración de BD
- Testing end-to-end
- Implementar analytics en admin

---

## 🔗 Referencias

Todos los cambios están basados en research de:
- [React-admin AutoSave](https://marmelab.com/react-admin/AutoSave.html) - 3 segundos default
- [SpeedKit: Beacon Reliability](https://www.speedkit.com/blog/unload-beacon-reliability-benchmarking-strategies-for-minimal-data-loss) - 91% confiabilidad
- [CSS-Tricks: HTTP on Page Exit](https://css-tricks.com/send-an-http-request-on-page-exit/)

Ver `ENCUESTA_AUTOSAVE_INTEGRATION.md` para documentación completa.
