<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class People extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'people';

    protected $fillable = [
        'nombre',
        'email',
        'pais',
        'whatsapp',
        'is_admin',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
        ];
    }

    /**
     * Relación con respuestas de encuestas
     */
    public function respuestas()
    {
        return $this->hasMany(Respuesta::class, 'people_id');
    }

    /**
     * Relación con lecturas de Biblia
     */
    public function bibleReadings()
    {
        return $this->hasMany(BibleReading::class, 'people_id');
    }

    /**
     * Oraciones que el usuario ha completado o iniciado
     */
    public function oraciones()
    {
        return $this->belongsToMany(Oracion::class, 'oracion_usuario', 'people_id', 'oracion_id')
            ->withPivot('completada_at', 'progreso')
            ->withTimestamps();
    }

    /**
     * Oraciones completadas por el usuario
     */
    public function oracionesCompletadas()
    {
        return $this->belongsToMany(Oracion::class, 'oracion_usuario', 'people_id', 'oracion_id')
            ->wherePivotNotNull('completada_at')
            ->withPivot('completada_at', 'progreso')
            ->withTimestamps();
    }
}
