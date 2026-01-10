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
        Schema::create('bible_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('people_id')->constrained('people')->onDelete('cascade');
            $table->string('book'); // Nombre del libro (ej: "Génesis", "Juan")
            $table->integer('chapter'); // Número del capítulo
            $table->timestamps();

            // Índices para mejorar consultas
            $table->index('people_id');
            $table->index('book');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bible_readings');
    }
};
