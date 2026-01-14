<?php

namespace Database\Seeders;

use App\Models\Encuesta;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class EncuestaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('encuesta')->truncate();

        $questions = [
            // Step 1 (10% progress) - Compromiso Inicial
            ['id' => 'tiempo_diario', 'pregunta' => '¿Cuánto tiempo quieres dedicarle a tu vida de oración cada día?'],
            ['id' => 'momento_preferido', 'pregunta' => '¿En qué momento del día prefieres orar?'],

            // Step 2 (20% progress) - Necesidades Emocionales
            ['id' => 'area_mejorar', 'pregunta' => '¿Qué área te gustaría mejorar primero? (Selecciona todas las que apliquen)'],
            ['id' => 'nivel_estres', 'pregunta' => '¿Cómo describirías tu nivel de estrés actualmente?'],

            // Step 3 (30% progress) - Experiencia Espiritual
            ['id' => 'experiencia_oracion', 'pregunta' => '¿Cuál es tu experiencia con la oración?'],
            ['id' => 'temas_oracion', 'pregunta' => '¿Sobre qué temas te gustaría orar? (Selecciona todos los que quieras)'],

            // Step 4 (40% progress) - Contexto Religioso
            ['id' => 'denominacion', 'pregunta' => '¿Con qué denominación cristiana te identificas?'],
            ['id' => 'asistencia_iglesia', 'pregunta' => '¿Con qué frecuencia asistes a una iglesia o comunidad de fe?'],

            // Step 5 (50% progress) - Conocimiento Bíblico
            ['id' => 'lectura_biblia', 'pregunta' => '¿Con qué frecuencia lees la Biblia?'],
            ['id' => 'conocimiento_biblico', 'pregunta' => '¿Cómo describirías tu conocimiento de la Biblia?'],

            // Step 6 (60% progress) - Sistema de Apoyo
            ['id' => 'sistema_apoyo', 'pregunta' => '¿Cuántas personas pueden apoyarte en momentos difíciles?'],
            ['id' => 'estado_civil', 'pregunta' => '¿Cuál es tu estado civil?'],

            // Step 7 (70% progress) - Perfil Familiar
            ['id' => 'tiene_hijos', 'pregunta' => '¿Tienes hijos?'],
            ['id' => 'genero', 'pregunta' => '¿Cuál es tu género? (Esto nos ayuda a personalizar el contenido)'],

            // Step 8 (80% progress) - Perfil Demográfico
            ['id' => 'grupo_edad', 'pregunta' => '¿Cuál es tu grupo de edad?'],
            ['id' => 'formato_preferido', 'pregunta' => '¿Qué formato de contenido prefieres?'],

            // Step 9 (90% progress) - Hábitos y Recordatorios
            ['id' => 'recordatorios', 'pregunta' => '¿Te gustaría recibir recordatorios diarios para orar?'],
            ['id' => 'frecuencia_recordatorios', 'pregunta' => 'Si activas recordatorios, ¿cuántos por día prefieres?'],

            // Step 10 (100% progress) - Funcionalidades y Premium
            ['id' => 'funcionalidades_deseadas', 'pregunta' => '¿Qué funcionalidades te gustaría que incluyera nuestro servicio? (Selecciona todas)'],
            ['id' => 'experiencia_premium', 'pregunta' => '¿Te interesaría una experiencia sin anuncios y con contenido exclusivo?'],
            ['id' => 'interes_donacion', 'pregunta' => '¿Te gustaría ayudar con una donación?'],
        ];


        foreach ($questions as $question) {
            Encuesta::create([
                'pregunta' => $question['pregunta'],
                // We are not storing the ID, but letting the DB auto-increment.
                // The frontend logic seems to fetch the first survey and use its ID.
                // The response JSON will contain the answers with the question ID from the frontend.
            ]);
        }
    }
}
