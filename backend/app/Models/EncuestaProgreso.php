<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EncuestaProgreso extends Model
{
    protected $table = 'encuesta_progreso';

    protected $fillable = [
        'people_id',
        'paso_actual',
        'ultimo_paso_completado',
        'ultima_pregunta_vista',
        'preguntas_respondidas',
        'respuestas_parciales',
        'estado',
        'completada',
        'ultima_interaccion_at',
    ];

    protected $casts = [
        'preguntas_respondidas' => 'array',
        'respuestas_parciales' => 'array',
        'completada' => 'boolean',
        'ultima_interaccion_at' => 'datetime',
    ];

    /**
     * Relación con el usuario (People)
     */
    public function person(): BelongsTo
    {
        return $this->belongsTo(People::class, 'people_id');
    }

    /**
     * Scopes para queries comunes
     */

    // Usuarios que abandonaron (tienen progreso pero no completaron)
    public function scopeAbandonados($query)
    {
        return $query->where('estado', 'en_progreso')
            ->where('completada', false);
    }

    // Usuarios que completaron
    public function scopeCompletadas($query)
    {
        return $query->where('completada', true);
    }

    // Usuarios en un paso específico
    public function scopeEnPaso($query, $paso)
    {
        return $query->where('paso_actual', $paso);
    }

    // Usuarios con high intent (escribieron algo pero no completaron)
    public function scopeConInteraccion($query)
    {
        return $query->whereNotNull('respuestas_parciales')
            ->whereRaw('JSON_LENGTH(respuestas_parciales) > 0')
            ->where('completada', false);
    }

    // Usuarios sin interacción (no escribieron nada)
    public function scopeSinInteraccion($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('respuestas_parciales')
              ->orWhereRaw('JSON_LENGTH(respuestas_parciales) = 0');
        })->where('completada', false);
    }
}
