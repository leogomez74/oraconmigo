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
        Schema::table('encuesta', function (Blueprint $table) {
            $table->string('tipo');
            $table->json('opciones')->nullable();
            $table->boolean('obligatoria')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('encuesta', function (Blueprint $table) {
            $table->dropColumn('tipo');
            $table->dropColumn('opciones');
            $table->dropColumn('obligatoria');
            //
        });
    }
};
