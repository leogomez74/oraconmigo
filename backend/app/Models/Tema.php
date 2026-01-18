<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tema extends Model
{
    protected $table = 'temas';

    protected $primaryKey = 'whatsapp';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'whatsapp',
        'salud',
        'familia',
        'trabajo',
        'paz',
        'guia',
        'gratitud',
        'perdon',
    ];

    protected $casts = [
        'salud' => 'boolean',
        'familia' => 'boolean',
        'trabajo' => 'boolean',
        'paz' => 'boolean',
        'guia' => 'boolean',
        'gratitud' => 'boolean',
        'perdon' => 'boolean',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(People::class, 'whatsapp', 'whatsapp');
    }
}
