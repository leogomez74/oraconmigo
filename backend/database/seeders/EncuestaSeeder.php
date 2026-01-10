<?php

namespace Database\Seeders;

use App\Models\Encuesta;
use Illuminate\Database\Seeder;

class EncuestaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $encuestas = [
            ['pregunta' => '¿Cuál es tu experiencia con nuestra plataforma?'],
            ['pregunta' => '¿Qué funcionalidades te gustaría que añadiéramos?'],
            ['pregunta' => '¿Recomendarías nuestro servicio a otros?'],
            ['pregunta' => '¿Cómo calificarías la facilidad de uso de la aplicación?'],
            ['pregunta' => '¿Qué aspecto de nuestra plataforma consideras más valioso?'],
        ];

        foreach ($encuestas as $encuesta) {
            Encuesta::create($encuesta);
        }
    }
}
