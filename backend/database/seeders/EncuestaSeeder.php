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
        // Eliminar preguntas removidas del flujo (17-21)
        Encuesta::whereIn('codigo', [
            'recordatorios',
            'frecuencia_recordatorios',
            'funcionalidades_deseadas',
            'experiencia_premium',
            'interes_donacion',
        ])->delete();

        $questions = [
            // Step 1
            [
                'codigo' => 'tiempo_diario',
                'pregunta' => '¿Cuánto tiempo quieres dedicarle a tu vida de oración cada día?',
                'tipo' => 'radio',
                'opciones' => ['5 minutos al día', '10 minutos al día', '15 minutos al día', '30+ minutos al día'],
                'obligatoria' => true,
            ],
            [
                'codigo' => 'momento_preferido',
                'pregunta' => '¿En qué momento del día prefieres orar?',
                'tipo' => 'radio',
                'opciones' => ['Por la mañana al despertar', 'Durante el día (mediodía)', 'Por la tarde', 'Por la noche antes de dormir', 'Cualquier momento'],
                'obligatoria' => true,
            ],

            // Step 2
            [
                'codigo' => 'area_mejorar',
                'pregunta' => '¿Qué área te gustaría mejorar primero? (Selecciona todas las que apliquen)',
                'tipo' => 'multiple_choice',
                'opciones' => ['Reducir el estrés', 'Disminuir la ansiedad', 'Mejorar el ánimo', 'Dormir mejor', 'Crecer espiritualmente', 'Encontrar sentido y propósito'],
                'obligatoria' => true,
            ],
            [
                'codigo' => 'nivel_estres',
                'pregunta' => '¿Cómo describirías tu nivel de estrés actualmente?',
                'tipo' => 'radio',
                'opciones' => ['Muy alto', 'Alto', 'Moderado', 'Bajo', 'Muy bajo'],
                'obligatoria' => true,
            ],

            // Step 3
            [
                'codigo' => 'experiencia_oracion',
                'pregunta' => '¿Cuál es tu experiencia con la oración?',
                'tipo' => 'radio',
                'opciones' => ['Soy nuevo en esto', 'He orado algunas veces', 'Oro ocasionalmente', 'Oro regularmente', 'Oro diariamente'],
                'obligatoria' => true,
            ],
            [
                'codigo' => 'temas_oracion',
                'pregunta' => '¿Sobre qué temas te gustaría orar? (Selecciona todos los que quieras)',
                'tipo' => 'multiple_choice',
                'opciones' => ['Salud y sanación', 'Familia y relaciones', 'Trabajo y finanzas', 'Guía y dirección', 'Gratitud y perdón'],
                'obligatoria' => true,
            ],

            // Step 4
            [
                'codigo' => 'denominacion',
                'pregunta' => '¿Con qué denominación cristiana te identificas?',
                'tipo' => 'radio',
                'opciones' => ['Católico', 'Protestante/Evangélico', 'Ortodoxo', 'Pentecostal', 'Bautista', 'Adventista'],
                'obligatoria' => false,
            ],
            [
                'codigo' => 'asistencia_iglesia',
                'pregunta' => '¿Con qué frecuencia asistes a una iglesia o comunidad de fe?',
                'tipo' => 'radio',
                'opciones' => ['Varias veces por semana', 'Una vez por semana', 'Una o dos veces al mes', 'Ocasionalmente', 'Casi nunca', 'Nunca'],
                'obligatoria' => false,
            ],

            // Step 5
            [
                'codigo' => 'lectura_biblia',
                'pregunta' => '¿Con qué frecuencia lees la Biblia?',
                'tipo' => 'radio',
                'opciones' => ['Diariamente', 'Varias veces por semana', 'Una vez por semana', 'Ocasionalmente', 'Casi nunca', 'Nunca'],
                'obligatoria' => false,
            ],
            [
                'codigo' => 'conocimiento_biblico',
                'pregunta' => '¿Cómo describirías tu conocimiento de la Biblia?',
                'tipo' => 'radio',
                'opciones' => ['Principiante (recién empiezo)', 'Básico (conozco algunas historias)', 'Intermedio (he leído varias partes)', 'Avanzado (la he leído completa)', 'Experto (la estudio profundamente)'],
                'obligatoria' => false,
            ],

            // Step 6
            [
                'codigo' => 'sistema_apoyo',
                'pregunta' => '¿Cuántas personas pueden apoyarte en momentos difíciles?',
                'tipo' => 'radio',
                'opciones' => ['3 o más', '2 personas', '1 persona', 'Solo yo'],
                'obligatoria' => true,
            ],
            [
                'codigo' => 'estado_civil',
                'pregunta' => '¿Cuál es tu estado civil?',
                'tipo' => 'radio',
                'opciones' => ['Soltero/a', 'En una relación', 'Casado/a', 'Divorciado/a', 'Viudo/a'],
                'obligatoria' => false,
            ],

            // Step 7
            [
                'codigo' => 'tiene_hijos',
                'pregunta' => '¿Tienes hijos?',
                'tipo' => 'radio',
                'opciones' => ['Sí, menores de edad', 'Sí, mayores de edad', 'Sí, de ambas edades', 'No tengo hijos', 'Prefiero no decir'],
                'obligatoria' => false,
            ],
            [
                'codigo' => 'genero',
                'pregunta' => '¿Cuál es tu género? (Esto nos ayuda a personalizar el contenido)',
                'tipo' => 'radio',
                'opciones' => ['Hombre', 'Mujer', 'Prefiero no decir'],
                'obligatoria' => false,
            ],

            // Step 8
            [
                'codigo' => 'grupo_edad',
                'pregunta' => '¿Cuál es tu grupo de edad?',
                'tipo' => 'radio',
                'opciones' => ['13-17', '18-30', '31-40', '41-50', '50+'],
                'obligatoria' => false,
            ],
            [
                'codigo' => 'formato_preferido',
                'pregunta' => '¿Qué formato de contenido prefieres?',
                'tipo' => 'multiple_choice',
                'opciones' => ['Audio guiado', 'Texto para leer', 'Video', 'Música de fondo', 'Imágenes inspiradoras', 'Cualquiera'],
                'obligatoria' => true,
            ],
        ];

        foreach ($questions as $question) {
            $codigo = $question['codigo'];

            $encuesta = Encuesta::where('codigo', $codigo)->first();

            if (!$encuesta) {
                // Migración suave desde registros viejos sin codigo
                $encuesta = Encuesta::whereNull('codigo')
                    ->where('pregunta', $question['pregunta'])
                    ->first();
            }

            if ($encuesta) {
                $encuesta->fill([
                    'codigo' => $codigo,
                    'pregunta' => $question['pregunta'],
                    'tipo' => $question['tipo'],
                    'opciones' => $question['opciones'],
                    'obligatoria' => $question['obligatoria'],
                ])->save();
            } else {
                Encuesta::create([
                    'codigo' => $codigo,
                    'pregunta' => $question['pregunta'],
                    'tipo' => $question['tipo'],
                    // El modelo se encargará de convertir este array a JSON gracias al cast
                    'opciones' => $question['opciones'],
                    'obligatoria' => $question['obligatoria'],
                ]);
            }
        }
    }
}
