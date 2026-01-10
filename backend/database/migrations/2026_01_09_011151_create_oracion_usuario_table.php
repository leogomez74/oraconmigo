<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('oracion_usuario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('people_id')->constrained('people')->onDelete('cascade');
            $table->foreignId('oracion_id')->constrained('oraciones')->onDelete('cascade');
            $table->timestamp('completada_at')->nullable(); // Fecha cuando completó la oración
            $table->integer('progreso')->default(0); // Progreso en porcentaje (0-100)
            $table->timestamps();

            // Índices para mejorar consultas
            $table->index('people_id');
            $table->index('oracion_id');
            $table->index('completada_at');

            // Evitar duplicados: un usuario no puede tener múltiples registros de la misma oración
            $table->unique(['people_id', 'oracion_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oracion_usuario');
    }
};
