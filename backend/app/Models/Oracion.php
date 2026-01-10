<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Oracion extends Model
{
    protected $table = 'oraciones';

    protected $fillable = [
        'titulo',
        'categoria',
        'descripcion',
        'contenido_texto',
        'audio_url',
        'duracion',
        'es_premium',
        'orden',
    ];

    protected function casts(): array
    {
        return [
            'es_premium' => 'boolean',
            'duracion' => 'integer',
            'orden' => 'integer',
        ];
    }

    /**
     * Usuarios que han completado esta oración
     */
    public function usuarios(): BelongsToMany
    {
        return $this->belongsToMany(People::class, 'oracion_usuario', 'oracion_id', 'people_id')
            ->withPivot('completada_at', 'progreso')
            ->withTimestamps();
    }

    /**
     * Scope para obtener solo oraciones gratuitas
     */
    public function scopeGratuitas($query)
    {
        return $query->where('es_premium', false);
    }

    /**
     * Scope para obtener solo oraciones premium
     */
    public function scopePremium($query)
    {
        return $query->where('es_premium', true);
    }

    /**
     * Scope para obtener oraciones por categoría
     */
    public function scopeCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Scope para ordenar por orden personalizado
     */
    public function scopeOrdenado($query)
    {
        return $query->orderBy('orden', 'asc')->orderBy('id', 'asc');
    }
}
