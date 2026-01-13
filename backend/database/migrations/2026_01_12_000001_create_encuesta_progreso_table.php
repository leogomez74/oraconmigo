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
        Schema::create('encuesta_progreso', function (Blueprint $table) {
            $table->id();
            $table->foreignId('people_id')->constrained('people')->onDelete('cascade');

            // Tracking de pasos
            $table->integer('paso_actual')->default(1)->comment('Paso en el que está actualmente (1-4)');
            $table->integer('ultimo_paso_completado')->default(0)->comment('Último paso que envió completamente (0-4)');

            // Tracking de preguntas
            $table->string('ultima_pregunta_vista')->nullable()->comment('ID de la última pregunta que vio');
            $table->json('preguntas_respondidas')->nullable()->comment('Array de IDs de preguntas respondidas');

            // Datos
            $table->json('respuestas_parciales')->nullable()->comment('Todas las respuestas hasta el momento');

            // Estado
            $table->enum('estado', ['sin_iniciar', 'en_progreso', 'completada', 'abandonada'])->default('sin_iniciar');
            $table->boolean('completada')->default(false);

            // Timestamps
            $table->timestamp('ultima_interaccion_at')->nullable()->comment('Última vez que interactuó con la encuesta');
            $table->timestamps();

            // Índices para queries optimizadas
            $table->index('estado');
            $table->index('paso_actual');
            $table->index('completada');
            $table->index('ultima_interaccion_at');

            // Un usuario solo puede tener un registro de progreso
            $table->unique('people_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encuesta_progreso');
    }
};
