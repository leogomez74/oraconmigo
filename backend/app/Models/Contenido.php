<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contenido extends Model
{
    protected $table = 'contenido';

    protected $primaryKey = 'whatsapp';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'whatsapp',
        'audio',
        'video',
        'texto',
        'musica',
        'imagenes',
        'cualquiera',
    ];

    protected $casts = [
        'audio' => 'boolean',
        'video' => 'boolean',
        'texto' => 'boolean',
        'musica' => 'boolean',
        'imagenes' => 'boolean',
        'cualquiera' => 'boolean',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(People::class, 'whatsapp', 'whatsapp');
    }
}
