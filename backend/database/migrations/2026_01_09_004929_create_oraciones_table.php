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
        Schema::create('oraciones', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('categoria'); // Mañana, Noche, Gratitud, Sanación, etc.
            $table->text('descripcion')->nullable(); // Breve descripción de la oración
            $table->longText('contenido_texto'); // Texto completo de la oración
            $table->string('audio_url')->nullable(); // URL del audio (opcional)
            $table->integer('duracion')->nullable(); // Duración en segundos
            $table->boolean('es_premium')->default(false); // Gratuita o premium
            $table->integer('orden')->default(0); // Orden de visualización
            $table->timestamps();

            // Índices para mejorar consultas
            $table->index('categoria');
            $table->index('es_premium');
            $table->index('orden');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oraciones');
    }
};
