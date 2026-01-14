<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Encuesta extends Model
{
    protected $table = 'encuesta';

    protected $fillable = [
        'pregunta',
        'tipo',
        'opciones',
        'obligatoria',
    ];

    protected $casts = [
        'opciones' => 'array',
        'obligatoria' => 'boolean',
    ];
}
