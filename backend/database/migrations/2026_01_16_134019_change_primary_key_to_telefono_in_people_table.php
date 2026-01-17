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
        // 1. Primero renombrar whatsapp a whatsapp y hacerlo required
        Schema::table('people', function (Blueprint $table) {
            $table->renameColumn('whatsapp', 'whatsapp');
        });

        Schema::table('people', function (Blueprint $table) {
            $table->string('whatsapp')->nullable(false)->change();
        });

        // 2. Agregar columna whatsapp a tablas relacionadas (para mapear)
        Schema::table('respuestas', function (Blueprint $table) {
            $table->string('people_whatsapp')->nullable()->after('people_id');
        });

        Schema::table('encuesta_progreso', function (Blueprint $table) {
            $table->string('people_whatsapp')->nullable()->after('people_id');
        });

        Schema::table('oracion_usuario', function (Blueprint $table) {
            $table->string('people_whatsapp')->nullable()->after('people_id');
        });

        Schema::table('bible_readings', function (Blueprint $table) {
            $table->string('people_whatsapp')->nullable()->after('people_id');
        });

        // 3. Copiar datos de people_id a people_whatsapp
        DB::statement('UPDATE respuestas r JOIN people p ON r.people_id = p.id SET r.people_whatsapp = p.whatsapp');
        DB::statement('UPDATE encuesta_progreso ep JOIN people p ON ep.people_id = p.id SET ep.people_whatsapp = p.whatsapp');
        DB::statement('UPDATE oracion_usuario ou JOIN people p ON ou.people_id = p.id SET ou.people_whatsapp = p.whatsapp');
        DB::statement('UPDATE bible_readings br JOIN people p ON br.people_id = p.id SET br.people_whatsapp = p.whatsapp');

        // 4. Eliminar foreign keys y columnas people_id antiguas
        Schema::table('respuestas', function (Blueprint $table) {
            $table->dropForeign(['people_id']);
            $table->dropColumn('people_id');
            $table->renameColumn('people_whatsapp', 'people_id');
        });

        Schema::table('encuesta_progreso', function (Blueprint $table) {
            $table->dropForeign(['people_id']);
            $table->dropUnique(['people_id']);
            $table->dropColumn('people_id');
            $table->renameColumn('people_whatsapp', 'people_id');
        });

        Schema::table('oracion_usuario', function (Blueprint $table) {
            $table->dropForeign(['people_id']);
            $table->dropUnique(['people_id', 'oracion_id']);
            $table->dropIndex(['people_id']);
            $table->dropColumn('people_id');
            $table->renameColumn('people_whatsapp', 'people_id');
        });

        Schema::table('bible_readings', function (Blueprint $table) {
            $table->dropForeign(['people_id']);
            $table->dropIndex(['people_id']);
            $table->dropColumn('people_id');
            $table->renameColumn('people_whatsapp', 'people_id');
        });

        // 5. Cambiar primary key en people
        Schema::table('people', function (Blueprint $table) {
            $table->dropColumn('id');
            $table->primary('whatsapp');
        });

        // 6. Agregar nuevas foreign keys
        Schema::table('respuestas', function (Blueprint $table) {
            $table->foreign('people_id')->references('whatsapp')->on('people')->onDelete('cascade');
        });

        Schema::table('encuesta_progreso', function (Blueprint $table) {
            $table->foreign('people_id')->references('whatsapp')->on('people')->onDelete('cascade');
            $table->unique('people_id');
        });

        Schema::table('oracion_usuario', function (Blueprint $table) {
            $table->foreign('people_id')->references('whatsapp')->on('people')->onDelete('cascade');
            $table->index('people_id');
            $table->unique(['people_id', 'oracion_id']);
        });

        Schema::table('bible_readings', function (Blueprint $table) {
            $table->foreign('people_id')->references('whatsapp')->on('people')->onDelete('cascade');
            $table->index('people_id');
        });
>>>>>>> 357fbd8 (cambio telefono a whatsapp)
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
