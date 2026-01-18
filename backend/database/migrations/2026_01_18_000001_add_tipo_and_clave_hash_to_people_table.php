<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('people', function (Blueprint $table) {
            if (!Schema::hasColumn('people', 'tipo')) {
                $table->string('tipo')->default('cliente')->after('pais');
            }

            if (!Schema::hasColumn('people', 'clave_hash')) {
                $table->string('clave_hash')->nullable();
            }
        });

        // Si ya existen admins, los marcamos como empleados por defecto
        if (Schema::hasColumn('people', 'is_admin') && Schema::hasColumn('people', 'tipo')) {
            DB::table('people')
                ->where('is_admin', true)
                ->update(['tipo' => 'empleado']);
        }
    }

    public function down(): void
    {
        Schema::table('people', function (Blueprint $table) {
            if (Schema::hasColumn('people', 'clave_hash')) {
                $table->dropColumn('clave_hash');
            }
            if (Schema::hasColumn('people', 'tipo')) {
                $table->dropColumn('tipo');
            }
        });
    }
};
