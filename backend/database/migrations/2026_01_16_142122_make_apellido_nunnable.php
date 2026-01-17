<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('people', 'apellido')) {
            return;
        }

        // Avoid Doctrine DBAL dependency required by ->change()
        DB::statement('ALTER TABLE `people` MODIFY `apellido` VARCHAR(255) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasColumn('people', 'apellido')) {
            return;
        }

        // If any rows have NULL, normalize before switching to NOT NULL
        DB::statement("UPDATE `people` SET `apellido` = '' WHERE `apellido` IS NULL");
        DB::statement('ALTER TABLE `people` MODIFY `apellido` VARCHAR(255) NOT NULL');
    }
};
