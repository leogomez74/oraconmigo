<?php

namespace Database\Seeders;

use App\Models\Encuesta;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EncuestaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiamos la tabla antes de insertar para evitar duplicados

        $questions = [
            // Step 1 (10% progress) - Compromiso Inicial
            [
                'pregunta' => '¿Cuánto tiempo quieres dedicarle a tu vida de oración cada día?',
                'tipo' => 'radio',
                'opciones' => ['5 minutos al día', '10 minutos al día', '15 minutos al día', '30+ minutos al día'],
                'obligatoria' => true,
            ],
            [
                'pregunta' => '¿En qué momento del día prefieres orar?',
                'tipo' => 'radio',
                'opciones' => ['Por la mañana al despertar', 'Durante el día (mediodía)', 'Por la tarde', 'Por la noche antes de dormir', 'Cualquier momento'],
                'obligatoria' => true,
            ],

            // Step 2 (20% progress) - Necesidades Emocionales
            [
                'pregunta' => '¿Qué área te gustaría mejorar primero? (Selecciona todas las que apliquen)',
                'tipo' => 'multiple_choice',
                'opciones' => ['Reducir el estrés', 'Disminuir la ansiedad', 'Mejorar el ánimo', 'Dormir mejor', 'Crecer espiritualmente', 'Encontrar sentido y propósito'],
                'obligatoria' => true,
            ],
            [
                'pregunta' => '¿Cómo describirías tu nivel de estrés actualmente?',
                'tipo' => 'radio',
                'opciones' => ['Muy alto', 'Alto', 'Moderado', 'Bajo', 'Muy bajo'],
                'obligatoria' => true,
            ],

            // Step 3 (30% progress) - Experiencia Espiritual
            [
                'pregunta' => '¿Cuál es tu experiencia con la oración?',
                'tipo' => 'radio',
                'opciones' => ['Soy nuevo en esto', 'He orado algunas veces', 'Oro ocasionalmente', 'Oro regularmente', 'Oro diariamente'],
                'obligatoria' => true,
            ],
            [
                'pregunta' => '¿Sobre qué temas te gustaría orar? (Selecciona todos los que quieras)',
                'tipo' => 'multiple_choice',
                'opciones' => ['Salud y sanación', 'Familia y relaciones', 'Trabajo y finanzas', 'Paz interior', 'Guía y dirección', 'Gratitud', 'Perdón', 'Fortaleza'],
                'obligatoria' => true,
            ],

            // Step 4 (40% progress) - Contexto Religioso
            [
                'pregunta' => '¿Con qué denominación cristiana te identificas?',
                'tipo' => 'radio',
                'opciones' => ['Católico', 'Protestante/Evangélico', 'Ortodoxo', 'Pentecostal', 'Bautista', 'Adventista', 'Otra', 'Prefiero no decir'],
                'obligatoria' => false,
            ],
            [
                'pregunta' => '¿Con qué frecuencia asistes a una iglesia o comunidad de fe?',
                'tipo' => 'radio',
                'opciones' => ['Varias veces por semana', 'Una vez por semana', 'Una o dos veces al mes', 'Ocasionalmente', 'Casi nunca', 'Nunca'],
                'obligatoria' => false,
            ],

            // Step 5 (50% progress) - Conocimiento Bíblico
            [
                'pregunta' => '¿Con qué frecuencia lees la Biblia?',
                'tipo' => 'radio',
                'opciones' => ['Diariamente', 'Varias veces por semana', 'Una vez por semana', 'Ocasionalmente', 'Casi nunca', 'Nunca'],
                'obligatoria' => false,
            ],
            [
                'pregunta' => '¿Cómo describirías tu conocimiento de la Biblia?',
                'tipo' => 'radio',
                'opciones' => ['Principiante (recién empiezo)', 'Básico (conozco algunas historias)', 'Intermedio (he leído varias partes)', 'Avanzado (la he leído completa)', 'Experto (la estudio profundamente)'],
                'obligatoria' => false,
            ],

            // Step 6 (60% progress) - Sistema de Apoyo
            [
                'pregunta' => '¿Cuántas personas pueden apoyarte en momentos difíciles?',
                'tipo' => 'radio',
                'opciones' => ['3 o más', '2 personas', '1 persona', 'Solo yo'],
                'obligatoria' => true,
            ],
            [
                'pregunta' => '¿Cuál es tu estado civil?',
                'tipo' => 'radio',
                'opciones' => ['Soltero/a', 'En una relación', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Prefiero no decir'],
                'obligatoria' => false,
            ],

            // Step 7 (70% progress) - Perfil Familiar
            [
                'pregunta' => '¿Tienes hijos?',
                'tipo' => 'radio',
                'opciones' => ['Sí, menores de edad', 'Sí, mayores de edad', 'Sí, de ambas edades', 'No tengo hijos', 'Prefiero no decir'],
                'obligatoria' => false,
            ],
            [
                'pregunta' => '¿Cuál es tu género? (Esto nos ayuda a personalizar el contenido)',
                'tipo' => 'radio',
                'opciones' => ['Hombre', 'Mujer', 'Prefiero no decir'],
                'obligatoria' => false,
            ],

            // Step 8 (80% progress) - Perfil Demográfico
            [
                'pregunta' => '¿Cuál es tu grupo de edad?',
                'tipo' => 'radio',
                'opciones' => ['13-17', '18-24', '25-34', '35-44', '45-54', '55+', 'Prefiero no decir'],
                'obligatoria' => false,
            ],
            [
                'pregunta' => '¿Qué formato de contenido prefieres?',
                'tipo' => 'multiple_choice',
                'opciones' => ['Audio guiado', 'Texto para leer', 'Video', 'Música de fondo', 'Imágenes inspiradoras', 'Cualquiera'],
                'obligatoria' => true,
            ],
            // Step 10 (100% progress) - Funcionalidades y Premium
            [
                'pregunta' => '¿Qué funcionalidades te gustaría que incluyera nuestro servicio? (Selecciona todas)',
                'tipo' => 'multiple_choice',
                'opciones' => ['Oraciones programadas (mañana, mediodía, noche)', 'Biblia en un año', 'Audio para dormir', 'Contenido en video', 'Reflexiones diarias', 'Rastreo de progreso', 'Versículos diarios'],
                'obligatoria' => false,
            ],
            [
                'pregunta' => '¿Estarías en contra de tener una versión premium?',
                'tipo' => 'radio',
                'opciones' => ['No', 'Si, prefiero la versión gratuita', 'Depende de qué ofrece.'],
                'obligatoria' => true,
            ],
            [
                'pregunta' => '¿Estarías en contra de hacer un pequeño donativo?',
                'tipo' => 'radio',
                'opciones' => ['No', 'Si', 'Tal vez más adelante'],
                'obligatoria' => true,
            ],
        ];

        foreach ($questions as $question) {
            Encuesta::create([
                'pregunta' => $question['pregunta'],
                'tipo' => $question['tipo'],
                // El modelo se encargará de convertir este array a JSON gracias al cast
                'opciones' => $question['opciones'],
                'obligatoria' => $question['obligatoria'],
            ]);
        }
    }
}
