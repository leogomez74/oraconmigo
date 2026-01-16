<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Respuesta extends Model
{
    protected $fillable = [
        'encuesta_id',
        'people_id',
        'respuestas',
    ];

    protected $casts = [
        'respuestas' => 'array',
    ];

    public function encuesta(): BelongsTo
    {
        return $this->belongsTo(Encuesta::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(People::class, 'people_id');
    }
}
