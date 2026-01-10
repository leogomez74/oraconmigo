<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OracionUsuario extends Model
{
    protected $table = 'oracion_usuario';

    protected $fillable = [
        'people_id',
        'oracion_id',
        'completada_at',
        'progreso',
    ];

    protected function casts(): array
    {
        return [
            'completada_at' => 'datetime',
            'progreso' => 'integer',
        ];
    }

    /**
     * Relación con el usuario (People)
     */
    public function person(): BelongsTo
    {
        return $this->belongsTo(People::class, 'people_id');
    }

    /**
     * Relación con la oración
     */
    public function oracion(): BelongsTo
    {
        return $this->belongsTo(Oracion::class, 'oracion_id');
    }

    /**
     * Marcar la oración como completada
     */
    public function marcarCompletada()
    {
        $this->completada_at = now();
        $this->progreso = 100;
        $this->save();
    }
}
