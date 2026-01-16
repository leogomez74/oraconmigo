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
        Schema::dropIfExists('respuesta_multiples');
        Schema::dropIfExists('respuestas');

        Schema::create('respuestas', function (Blueprint $table) {
            $table->id();
            $table->string('people_id');
            $table->string('pregunta');
            $table->text('respuesta')->nullable(); // null si es respuesta múltiple
            $table->timestamps();

            $table->foreign('people_id')->references('telefono')->on('people')->onDelete('cascade');
        });

        Schema::create('respuesta_multiples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('respuesta_id')->constrained('respuestas')->onDelete('cascade');
            $table->string('people_id');
            $table->text('opcion');
            $table->timestamps();

            $table->foreign('people_id')->references('telefono')->on('people')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuesta_multiples');
        Schema::dropIfExists('respuestas');
    }
};
