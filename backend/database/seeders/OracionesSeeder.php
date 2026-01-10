<?php

namespace Database\Seeders;

use App\Models\Oracion;
use Illuminate\Database\Seeder;

class OracionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $oraciones = [
            // Oraciones Gratuitas
            [
                'titulo' => 'Padre Nuestro',
                'categoria' => 'Tradicional',
                'descripcion' => 'La oración que Jesús enseñó a sus discípulos',
                'contenido_texto' => "Padre nuestro que estás en el cielo,
santificado sea tu Nombre;
venga a nosotros tu reino;
hágase tu voluntad
en la tierra como en el cielo.

Danos hoy nuestro pan de cada día;
perdona nuestras ofensas,
como también nosotros perdonamos
a los que nos ofenden;
no nos dejes caer en la tentación,
y líbranos del mal.

Amén.",
                'duracion' => 60,
                'es_premium' => false,
                'orden' => 1,
            ],
            [
                'titulo' => 'Oración de la Mañana',
                'categoria' => 'Mañana',
                'descripcion' => 'Comienza tu día con gratitud y esperanza',
                'contenido_texto' => "Señor, te doy gracias por este nuevo día que me regalas.
Gracias por el descanso de la noche y por la luz que ilumina mi camino.

Te pido que me acompañes en cada momento de este día.
Dame fuerzas para enfrentar los desafíos,
sabiduría para tomar buenas decisiones,
y amor para compartir con quienes me rodean.

Que cada acción que realice hoy sea para tu gloria
y que pueda ser un instrumento de tu paz.

Amén.",
                'duracion' => 90,
                'es_premium' => false,
                'orden' => 2,
            ],
            [
                'titulo' => 'Oración de Gratitud',
                'categoria' => 'Gratitud',
                'descripcion' => 'Agradece por las bendiciones de tu vida',
                'contenido_texto' => "Padre celestial, hoy quiero darte gracias.

Gracias por mi vida, por mi salud, por mi familia.
Gracias por las oportunidades que me das cada día.
Gracias por tu amor incondicional que nunca me falta.

Ayúdame a reconocer tus bendiciones en cada momento,
incluso en las dificultades que me ayudan a crecer.

Dame un corazón agradecido que sepa valorar
todo lo que tengo y que pueda compartir
esa gratitud con los demás.

Amén.",
                'duracion' => 75,
                'es_premium' => false,
                'orden' => 3,
            ],
            [
                'titulo' => 'Oración de la Noche',
                'categoria' => 'Noche',
                'descripcion' => 'Termina tu día en paz y descanso',
                'contenido_texto' => "Señor, al finalizar este día vengo a ti.

Gracias por todo lo vivido hoy:
por los momentos de alegría y los de aprendizaje.

Te pido perdón por mis errores
y te entrego todas mis preocupaciones.

Protege mi descanso esta noche.
Cuida de mi familia y de todos mis seres queridos.

Que tu paz llene mi corazón
y pueda despertar mañana renovado
para servirte mejor.

Amén.",
                'duracion' => 80,
                'es_premium' => false,
                'orden' => 4,
            ],
            [
                'titulo' => 'Oración por la Paz',
                'categoria' => 'Paz',
                'descripcion' => 'Pide paz para tu corazón y para el mundo',
                'contenido_texto' => "Señor, Príncipe de la Paz,

Te pido paz para mi corazón,
que está lleno de preocupaciones y ansiedades.

Te pido paz para mi familia,
para que el amor reine en nuestro hogar.

Te pido paz para mi comunidad,
para que la justicia y la compasión prevalezcan.

Te pido paz para el mundo entero,
para que cesen las guerras y divisiones.

Hazme un instrumento de tu paz,
donde haya odio, que lleve amor;
donde haya ofensa, que lleve perdón;
donde haya duda, que lleve fe.

Amén.",
                'duracion' => 100,
                'es_premium' => false,
                'orden' => 5,
            ],

            // Oraciones Premium
            [
                'titulo' => 'Oración por Sanación Interior',
                'categoria' => 'Sanación',
                'descripcion' => 'Encuentra sanación para heridas del alma',
                'contenido_texto' => "Padre amoroso, sanador de cuerpos y almas,

Vengo a ti con mi corazón herido,
con dolores que solo tú conoces en profundidad.

Sana mis heridas emocionales,
las que vienen de mi pasado y las que cargo hoy.

Restaura mi confianza cuando me siento quebrado.
Renueva mi esperanza cuando todo parece oscuro.
Fortalece mi fe cuando las dudas me asaltan.

Sana mi relación conmigo mismo:
ayúdame a perdonarme,
a aceptarme,
a amarme como tú me amas.

Sana mis relaciones con los demás:
dame la gracia de perdonar a quienes me han herido
y el valor de pedir perdón a quienes he lastimado.

Sana todo aquello que me impide vivir en plenitud,
y llena cada espacio sanado con tu amor y tu paz.

Confío en tu poder sanador
y acepto tu voluntad en mi vida.

Amén.",
                'duracion' => 180,
                'es_premium' => true,
                'orden' => 6,
            ],
            [
                'titulo' => 'Oración en Momentos de Ansiedad',
                'categoria' => 'Paz',
                'descripcion' => 'Encuentra calma cuando la ansiedad te invade',
                'contenido_texto' => "Señor, mi corazón está agitado.
Los pensamientos dan vueltas en mi mente
y la ansiedad me quita la paz.

Te entrego ahora mismo todas mis preocupaciones:
(Toma un momento para nombrar específicamente lo que te preocupa)

Respiro profundamente tu presencia.
Inhalo tu paz... Exhalo mi ansiedad.

Tu palabra dice \"No se angustien por nada\",
y confío en tu promesa.

Ayúdame a enfocarme en el presente,
en este momento que es el único que tengo.

Mañana traerá sus propios afanes,
pero hoy elijo confiar en ti.

Calma la tormenta en mi interior.
Dame serenidad para aceptar lo que no puedo cambiar,
valor para cambiar lo que sí puedo,
y sabiduría para reconocer la diferencia.

Que tu paz, que sobrepasa todo entendimiento,
guarde mi corazón y mis pensamientos.

Respiro... y descanso en ti.

Amén.",
                'duracion' => 150,
                'es_premium' => true,
                'orden' => 7,
            ],
            [
                'titulo' => 'Oración por Fortaleza',
                'categoria' => 'Fortaleza',
                'descripcion' => 'Recibe fuerza divina en momentos de debilidad',
                'contenido_texto' => "Padre todopoderoso, fuente de toda fortaleza,

Reconozco que mis fuerzas se han agotado.
Me siento débil, cansado, sin ánimo para continuar.

Pero tu palabra promete que los que esperan en ti
renovarán sus fuerzas,
levantarán alas como las águilas,
correrán y no se cansarán,
caminarán y no se fatigarán.

Hoy reclamo esa promesa para mi vida.

Dame fortaleza física cuando mi cuerpo está agotado.
Dame fortaleza emocional cuando mis sentimientos me abruman.
Dame fortaleza espiritual cuando mi fe vacila.

Recuérdame que tu poder se perfecciona en mi debilidad,
y que puedo hacer todas las cosas a través de Cristo
que me fortalece.

No permitas que me rinda.
Ayúdame a levantarme una vez más,
a dar un paso más,
a creer una vez más.

Sé mi roca, mi fortaleza, mi refugio.

En ti encuentro la fuerza que necesito
para enfrentar cualquier desafío.

Amén.",
                'duracion' => 160,
                'es_premium' => true,
                'orden' => 8,
            ],
            [
                'titulo' => 'Oración por Sabiduría',
                'categoria' => 'Sabiduría',
                'descripcion' => 'Pide discernimiento para tomar decisiones',
                'contenido_texto' => "Padre sabio, fuente de toda sabiduría y entendimiento,

Vengo a ti porque necesito dirección.
Tengo decisiones importantes que tomar
y no sé qué camino seguir.

Tu palabra dice que si alguno tiene falta de sabiduría,
la pida a ti, y tú la darás abundantemente.

Hoy te pido esa sabiduría.

Ilumina mi mente para ver con claridad.
Guía mis pensamientos hacia lo que es verdadero y bueno.
Ayúdame a discernir entre las muchas voces que escucho.

Dame sabiduría para conocer tu voluntad,
no solo para esta decisión específica,
sino para toda mi vida.

Enséñame a buscar consejo sabio
y a reconocerlo cuando lo escuche.

Ayúdame a ser paciente,
a no apresurarme en mis decisiones,
y a confiar en que tú me guiarás en el tiempo perfecto.

Que tu Espíritu Santo sea mi consejero,
iluminando cada paso de mi camino.

Confío en que me darás la sabiduría que necesito,
porque tú eres fiel a tus promesas.

Amén.",
                'duracion' => 140,
                'es_premium' => true,
                'orden' => 9,
            ],
            [
                'titulo' => 'Oración por la Familia',
                'categoria' => 'Familia',
                'descripcion' => 'Bendice y protege a tu familia',
                'contenido_texto' => "Padre celestial, creador de la familia,

Te presento hoy a mi familia,
cada uno de sus miembros que amo profundamente.

Bendice nuestro hogar.
Que sea un lugar de amor, paz y seguridad.
Un refugio donde cada uno pueda ser él mismo
y sentirse aceptado y valorado.

Protege a cada miembro de mi familia:
(Nombra a cada persona específicamente)

Fortalece los lazos que nos unen.
Ayúdanos a comunicarnos con amor y respeto.
Enséñanos a perdonarnos rápidamente
y a celebrar juntos las alegrías de la vida.

Cuando vengan tiempos difíciles,
mantennos unidos.
Ayúdanos a apoyarnos mutuamente,
a ser pacientes con las debilidades de cada uno,
y a celebrar las fortalezas.

Bendice especialmente a:
[los niños, para que crezcan en sabiduría y amor]
[los jóvenes, para que encuentren su camino]
[los adultos, para que tengan sabiduría y paciencia]
[los ancianos, para que sean honrados y cuidados]

Que nuestra familia sea un reflejo de tu amor
y que podamos transmitir valores eternos
de generación en generación.

Amén.",
                'duracion' => 190,
                'es_premium' => true,
                'orden' => 10,
            ],
        ];

        foreach ($oraciones as $oracion) {
            Oracion::create($oracion);
        }
    }
}
