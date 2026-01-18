<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Objetivo extends Model
{
    protected $table = 'objetivos';

    protected $primaryKey = 'whatsapp';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'whatsapp',
        'estres',
        'ansiedad',
        'animo',
        'crecer',
        'sentido',
    ];

    protected $casts = [
        'estres' => 'boolean',
        'ansiedad' => 'boolean',
        'animo' => 'boolean',
        'crecer' => 'boolean',
        'sentido' => 'boolean',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(People::class, 'whatsapp', 'whatsapp');
    }
}
