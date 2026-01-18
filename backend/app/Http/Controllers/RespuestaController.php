<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\People;
use App\Models\Respuesta;
use App\Models\Objetivo;
use App\Models\Tema;
use App\Models\Contenido;
use Illuminate\Support\Facades\DB;

class RespuestaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'respuestas' => 'required|array',
        ]);

        $whatsapp = $request->user()->whatsapp;
        $respuestas = $validated['respuestas'];

        DB::beginTransaction();

        try {
            // 1) Guardar respuestas simples (1:1)
            $denominacion = $this->stringOrNull($respuestas['denominacion'] ?? null);
            if ($denominacion === 'Prefiero no decir') {
                $denominacion = null;
            }

            Respuesta::updateOrCreate(
                ['whatsapp' => $whatsapp],
                [
                    'minutosaldia' => $this->stringOrNull($respuestas['tiempo_diario'] ?? null),
                    'horadeorar' => $this->stringOrNull($respuestas['momento_preferido'] ?? null),
                    'estresactual' => $this->stringOrNull($respuestas['nivel_estres'] ?? null),
                    'experiencia' => $this->stringOrNull($respuestas['experiencia_oracion'] ?? null),
                    'denominacion' => $denominacion,
                    'frecuenciaiglesia' => $this->stringOrNull($respuestas['asistencia_iglesia'] ?? null),
                    'frecuenciabiblia' => $this->stringOrNull($respuestas['lectura_biblia'] ?? null),
                    'conocimiento' => $this->stringOrNull($respuestas['conocimiento_biblico'] ?? null),
                    'apoyos' => $this->stringOrNull($respuestas['sistema_apoyo'] ?? null),
                ]
            );

            // 2) Poblar demográficos opcionales en people
            $edad = $this->stringOrNull($respuestas['grupo_edad'] ?? null);
            if ($edad === 'Prefiero no decir') {
                $edad = null;
            }

            People::where('whatsapp', $whatsapp)->update([
                'estado_civil' => $this->stringOrNull($respuestas['estado_civil'] ?? null),
                'hijos' => $this->stringOrNull($respuestas['tiene_hijos'] ?? null),
                'genero' => $this->stringOrNull($respuestas['genero'] ?? null),
                'edad' => $edad,
            ]);

            // 3) Objetivos (multi)
            $objetivosSeleccionados = $this->arrayOfStrings($respuestas['area_mejorar'] ?? null);
            Objetivo::updateOrCreate(
                ['whatsapp' => $whatsapp],
                [
                    'estres' => in_array('Reducir el estrés', $objetivosSeleccionados, true),
                    'ansiedad' => in_array('Disminuir la ansiedad', $objetivosSeleccionados, true),
                    'animo' => in_array('Mejorar el ánimo', $objetivosSeleccionados, true),
                    'crecer' => in_array('Crecer espiritualmente', $objetivosSeleccionados, true),
                    'sentido' => in_array('Encontrar sentido y propósito', $objetivosSeleccionados, true),
                ]
            );

            // 4) Temas (multi) — se eliminó "Fortaleza"
            $temasSeleccionados = $this->arrayOfStrings($respuestas['temas_oracion'] ?? null);
            Tema::updateOrCreate(
                ['whatsapp' => $whatsapp],
                [
                    'salud' => in_array('Salud y sanación', $temasSeleccionados, true),
                    'familia' => in_array('Familia y relaciones', $temasSeleccionados, true),
                    'trabajo' => in_array('Trabajo y finanzas', $temasSeleccionados, true),
                    'paz' => false,
                    'guia' => in_array('Guía y dirección', $temasSeleccionados, true),
                    'gratitud' => in_array('Gratitud', $temasSeleccionados, true) || in_array('Gratitud y perdón', $temasSeleccionados, true),
                    'perdon' => in_array('Perdón', $temasSeleccionados, true) || in_array('Gratitud y perdón', $temasSeleccionados, true),
                ]
            );

            // 5) Contenido (multi)
            $contenidoSeleccionado = $this->arrayOfStrings($respuestas['formato_preferido'] ?? null);
            Contenido::updateOrCreate(
                ['whatsapp' => $whatsapp],
                [
                    'audio' => in_array('Audio guiado', $contenidoSeleccionado, true),
                    'texto' => in_array('Texto para leer', $contenidoSeleccionado, true),
                    'video' => in_array('Video', $contenidoSeleccionado, true),
                    'musica' => in_array('Música de fondo', $contenidoSeleccionado, true),
                    'imagenes' => in_array('Imágenes inspiradoras', $contenidoSeleccionado, true),
                    'cualquiera' => in_array('Cualquiera', $contenidoSeleccionado, true),
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Respuestas guardadas exitosamente',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar las respuestas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function stringOrNull(mixed $value): ?string
    {
        if (!is_string($value)) return null;
        $trimmed = trim($value);
        return $trimmed === '' ? null : $trimmed;
    }

    /**
     * @return string[]
     */
    private function arrayOfStrings(mixed $value): array
    {
        if (!is_array($value)) return [];
        return array_values(array_filter($value, fn ($v) => is_string($v) && trim($v) !== ''));
    }
}
