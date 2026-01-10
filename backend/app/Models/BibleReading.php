<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BibleReading extends Model
{
    protected $fillable = [
        'people_id',
        'book',
        'chapter',
    ];

    /**
     * Relación con el usuario (People)
     */
    public function person(): BelongsTo
    {
        return $this->belongsTo(People::class, 'people_id');
    }
}
