<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Demográficos opcionales que se pueblan desde la encuesta
        Schema::table('people', function (Blueprint $table) {
            if (!Schema::hasColumn('people', 'estado_civil')) {
                $table->string('estado_civil')->nullable()->after('pais');
            }
            if (!Schema::hasColumn('people', 'hijos')) {
                $table->string('hijos')->nullable()->after('estado_civil');
            }
            if (!Schema::hasColumn('people', 'genero')) {
                $table->string('genero')->nullable()->after('hijos');
            }
            if (!Schema::hasColumn('people', 'edad')) {
                $table->string('edad')->nullable()->after('genero');
            }
        });

        // Reemplaza el esquema legacy key/value por un perfil normalizado 1:1
        Schema::dropIfExists('respuesta_multiples');
        Schema::dropIfExists('respuestas');

        Schema::create('respuestas', function (Blueprint $table) {
            $table->string('whatsapp')->primary();

            $table->string('minutosaldia')->nullable();
            $table->string('horadeorar')->nullable();
            $table->string('estresactual')->nullable();
            $table->string('experiencia')->nullable();
            $table->string('denominacion')->nullable();
            $table->string('frecuenciaiglesia')->nullable();
            $table->string('frecuenciabiblia')->nullable();
            $table->string('conocimiento')->nullable();
            $table->string('apoyos')->nullable();

            $table->timestamps();

            $table->foreign('whatsapp')->references('whatsapp')->on('people')->onDelete('cascade');
        });

        Schema::create('objetivos', function (Blueprint $table) {
            $table->string('whatsapp')->primary();
            $table->boolean('estres')->default(false);
            $table->boolean('ansiedad')->default(false);
            $table->boolean('animo')->default(false);
            $table->boolean('crecer')->default(false);
            $table->boolean('sentido')->default(false);
            $table->timestamps();
            $table->foreign('whatsapp')->references('whatsapp')->on('people')->onDelete('cascade');
        });

        Schema::create('temas', function (Blueprint $table) {
            $table->string('whatsapp')->primary();
            $table->boolean('salud')->default(false);
            $table->boolean('familia')->default(false);
            $table->boolean('trabajo')->default(false);
            $table->boolean('paz')->default(false);
            $table->boolean('guia')->default(false);
            $table->boolean('gratitud')->default(false);
            $table->boolean('perdon')->default(false);
            $table->timestamps();
            $table->foreign('whatsapp')->references('whatsapp')->on('people')->onDelete('cascade');
        });

        Schema::create('contenido', function (Blueprint $table) {
            $table->string('whatsapp')->primary();
            $table->boolean('audio')->default(false);
            $table->boolean('video')->default(false);
            $table->boolean('texto')->default(false);
            $table->boolean('musica')->default(false);
            $table->boolean('imagenes')->default(false);
            $table->boolean('cualquiera')->default(false);
            $table->timestamps();
            $table->foreign('whatsapp')->references('whatsapp')->on('people')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contenido');
        Schema::dropIfExists('temas');
        Schema::dropIfExists('objetivos');
        Schema::dropIfExists('respuestas');

        Schema::table('people', function (Blueprint $table) {
            if (Schema::hasColumn('people', 'edad')) {
                $table->dropColumn('edad');
            }
            if (Schema::hasColumn('people', 'genero')) {
                $table->dropColumn('genero');
            }
            if (Schema::hasColumn('people', 'hijos')) {
                $table->dropColumn('hijos');
            }
            if (Schema::hasColumn('people', 'estado_civil')) {
                $table->dropColumn('estado_civil');
            }
        });

        // No recreamos tablas legacy en down.
    }
};
