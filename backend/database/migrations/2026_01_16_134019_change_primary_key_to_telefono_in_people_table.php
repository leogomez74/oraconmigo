<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // NOTA (2026-01-17): Decisión de producto
        // Mantenemos la columna `whatsapp` en `people` y el PK autoincrement `id`.
        // Esta migración originalmente renombraba `whatsapp` -> `telefono` y cambiaba
        // todas las FKs a `people.telefono`, pero eso ya no aplica.
        return;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir es muy complejo, mejor hacer migrate:fresh
        throw new \Exception('This migration cannot be reversed. Use migrate:fresh instead.');
    }
};
