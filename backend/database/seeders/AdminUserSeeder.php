<?php

namespace Database\Seeders;

use App\Models\People;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario admin si no existe
        People::firstOrCreate(
            ['email' => 'admin@oras.app'],
            [
                'nombre' => 'Administrador',
                'pais' => 'Argentina',
                'whatsapp' => '+5491112345678',
                'is_admin' => true,
            ]
        );

        $this->command->info('Usuario administrador creado: admin@oras.app');
    }
}
