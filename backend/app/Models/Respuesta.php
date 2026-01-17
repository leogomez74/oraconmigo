<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Respuesta extends Model
{
    protected $fillable = [
        'people_id',
        'pregunta',
        'respuesta',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(People::class, 'people_id');
    }

    public function multiples(): HasMany
    {
        return $this->hasMany(RespuestaMultiple::class);
    }
}
