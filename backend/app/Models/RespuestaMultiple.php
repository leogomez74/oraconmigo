<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RespuestaMultiple extends Model
{
    protected $fillable = [
        'respuesta_id',
        'people_id',
        'opcion',
    ];

    public function respuesta(): BelongsTo
    {
        return $this->belongsTo(Respuesta::class);
    }

    public function person(): BelongsTo
    {
<<<<<<< HEAD
        return $this->belongsTo(People::class, 'people_id');
=======
        return $this->belongsTo(People::class, 'people_id', 'whatsapp');
>>>>>>> 357fbd8 (cambio telefono a whatsapp)
    }
}
