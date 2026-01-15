<?php

namespace App\Http\Controllers;

use App\Models\BibleReading;
use App\Models\EncuestaProgreso;
use App\Models\Oracion;
use App\Models\OracionUsuario;
use App\Models\People;
use App\Models\Respuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Muestra el dashboard principal del administrador
     */
    public function dashboard()
    {
        // Métricas básicas
        $totalUsers = People::all()->count();
        $todayUsers = People::whereDate('created_at', '=', today())->count();
        $weekUsers = People::where('created_at', '>=', now()->subWeek())->count();
        $monthUsers = People::where('created_at', '>=', now()->subMonth())->count();

        // Usuarios activos (ejemplo: usuarios que han completado la encuesta)
        $activeUsers = People::whereHas('respuestas')->distinct()->count();

        // Encuestas completadas
        $completedSurveys = Respuesta::distinct()->count('people_id');

        // Usuarios que han leído la Biblia (al menos 1 capítulo)
        $bibleReaders = BibleReading::distinct()->count('people_id');

        // Lecturas de Biblia totales
        $totalBibleReadings = BibleReading::all()->count();

        // Lecturas de Biblia esta semana
        $weekBibleReadings = BibleReading::where('created_at', '>=', now()->subWeek())->count();

        // Top 5 libros más leídos
        $topBooks = BibleReading::select('book', DB::raw('count(*) as total'))
            ->groupBy('book')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        // Suscripciones (temporal, hasta que implementemos el sistema de pagos)
        $premiumUsers = 0;
        $freeUsers = $totalUsers;

        // Métricas de Oraciones
        // Total de oraciones completadas (usuarios que completaron alguna oración)
        $totalOracionesCompletadas = OracionUsuario::whereNotNull('completada_at')->count();

        // Usuarios que han completado al menos 1 oración
        $usuariosConOracionesCompletadas = OracionUsuario::whereNotNull('completada_at')
            ->distinct('people_id')
            ->count('people_id');

        // Oraciones más populares (top 5 por número de completadas)
        $oracionesPopulares = OracionUsuario::select('oracion_id', DB::raw('count(*) as total'))
            ->whereNotNull('completada_at')
            ->groupBy('oracion_id')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->with('oracion')
            ->get()
            ->map(function ($item) {
                return [
                    'titulo' => $item->oracion->titulo,
                    'categoria' => $item->oracion->categoria,
                    'total' => $item->total,
                ];
            });

        // Progreso promedio de todas las oraciones iniciadas
        $progresoPromedio = OracionUsuario::avg('progreso') ?? 0;

        // Distribución por categoría (oraciones completadas por categoría)
        $oracionesPorCategoria = OracionUsuario::whereNotNull('completada_at')
            ->join('oraciones', 'oracion_usuario.oracion_id', '=', 'oraciones.id')
            ->select('oraciones.categoria', DB::raw('count(*) as total'))
            ->groupBy('oraciones.categoria')
            ->orderBy('total', 'desc')
            ->get();

        // Total de oraciones disponibles (gratuitas y premium)
        $totalOracionesDisponibles = Oracion::count();
        $oracionesGratuitas = Oracion::where('es_premium', false)->count();
        $oracionesPremium = Oracion::where('es_premium', true)->count();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'totalUsers' => $totalUsers,
                'todayUsers' => $todayUsers,
                'weekUsers' => $weekUsers,
                'monthUsers' => $monthUsers,
                'activeUsers' => $activeUsers,
                'completedSurveys' => $completedSurveys,
                'bibleReaders' => $bibleReaders,
                'totalBibleReadings' => $totalBibleReadings,
                'weekBibleReadings' => $weekBibleReadings,
                'topBooks' => $topBooks,
                'premiumUsers' => $premiumUsers,
                'freeUsers' => $freeUsers,
                // Métricas de oraciones
                'totalOracionesCompletadas' => $totalOracionesCompletadas,
                'usuariosConOracionesCompletadas' => $usuariosConOracionesCompletadas,
                'oracionesPopulares' => $oracionesPopulares,
                'progresoPromedio' => round($progresoPromedio, 2),
                'oracionesPorCategoria' => $oracionesPorCategoria,
                'totalOracionesDisponibles' => $totalOracionesDisponibles,
                'oracionesGratuitas' => $oracionesGratuitas,
                'oracionesPremium' => $oracionesPremium,
            ],
        ]);
    }

    /**
     * Muestra el funnel de conversión
     */
    public function funnel()
    {
        // Paso 1: Usuarios registrados
        $registered = People::all()->count();

        // Paso 2: Usuarios que completaron la encuesta
        $completedSurvey = Respuesta::distinct()->count('people_id');

        // Paso 3: Usuarios que completaron al menos una oración
        $completedPrayer = OracionUsuario::whereNotNull('completada_at')
            ->distinct()
            ->count('people_id');

        // Paso 4: Usuarios premium (temporal, 0 hasta implementar suscripciones)
        $subscribed = 0;

        // Calcular tasas de conversión
        $surveyRate = $registered > 0 ? round(($completedSurvey / $registered) * 100, 2) : 0;
        $prayerRate = $completedSurvey > 0 ? round(($completedPrayer / $completedSurvey) * 100, 2) : 0;
        $subscriptionRate = $completedPrayer > 0 ? round(($subscribed / $completedPrayer) * 100, 2) : 0;

        return Inertia::render('Admin/Funnel', [
            'funnel' => [
                'steps' => [
                    [
                        'name' => 'Registro',
                        'count' => $registered,
                        'rate' => 100,
                    ],
                    [
                        'name' => 'Completó Encuesta',
                        'count' => $completedSurvey,
                        'rate' => $surveyRate,
                    ],
                    [
                        'name' => 'Primera Oración',
                        'count' => $completedPrayer,
                        'rate' => $prayerRate,
                    ],
                    [
                        'name' => 'Suscripción Premium',
                        'count' => $subscribed,
                        'rate' => $subscriptionRate,
                    ],
                ],
            ],
        ]);
    }

    /**
     * Lista de usuarios (para tabla de administración)
     */
    public function users(Request $request)
    {
        $query = People::query();

        // Búsqueda
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtros
        if ($request->has('filter')) {
            $filter = $request->input('filter');
            if ($filter === 'admin') {
                $query->where('is_admin', true);
            } elseif ($filter === 'premium') {
                // TODO: Filtrar por usuarios premium cuando se implemente
            } elseif ($filter === 'active') {
                $query->whereHas('respuestas');
            }
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'filter']),
        ]);
    }

    /**
     * Crea un nuevo usuario
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:people,email',
            'pais' => 'nullable|string|max:255',
            'whatsapp' => 'nullable|string|max:20',
            'is_admin' => 'boolean',
        ]);

        People::create($validated);

        return redirect()->back()->with('success', 'Usuario creado correctamente.');
    }

    /**
     * Actualiza un usuario existente
     */
    public function update(Request $request, $id)
    {
        $user = People::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:people,email,' . $id,
            'pais' => 'nullable|string|max:255',
            'whatsapp' => 'nullable|string|max:20',
            'is_admin' => 'boolean',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
    }

    /**
     * Elimina un usuario
     */
    public function destroy($id)
    {
        $user = People::findOrFail($id);
        $user->delete($id);

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }

    /**
     * Muestra analytics detallados de oraciones
     */
    public function content()
    {
        // Obtener todas las oraciones con sus estadísticas
        $oraciones = Oracion::withCount([
            'usuarios as total_iniciadas',
            'usuarios as total_completadas' => function ($query) {
                $query->whereNotNull('completada_at');
            }
        ])->get()->map(function ($oracion) {
            // Calcular tasa de completado
            $tasaCompletado = $oracion->total_iniciadas > 0
                ? round(($oracion->total_completadas / $oracion->total_iniciadas) * 100, 2)
                : 0;

            // Progreso promedio de esta oración específica
            $progresoPromedio = OracionUsuario::where('oracion_id', $oracion->id)
                ->avg('progreso') ?? 0;

            return [
                'id' => $oracion->id,
                'titulo' => $oracion->titulo,
                'categoria' => $oracion->categoria,
                'es_premium' => $oracion->es_premium,
                'duracion' => $oracion->duracion,
                'total_iniciadas' => $oracion->total_iniciadas,
                'total_completadas' => $oracion->total_completadas,
                'tasa_completado' => $tasaCompletado,
                'progreso_promedio' => round($progresoPromedio, 2),
            ];
        });

        // Oraciones completadas por semana (últimas 8 semanas)
        $oracionesPorSemana = [];
        for ($i = 7; $i >= 0; $i--) {
            $startDate = now()->subWeeks($i)->startOfWeek();
            $endDate = now()->subWeeks($i)->endOfWeek();

            $count = OracionUsuario::whereNotNull('completada_at')
                ->whereBetween('completada_at', [$startDate, $endDate])
                ->count();

            $oracionesPorSemana[] = [
                'semana' => $startDate->format('d M'),
                'total' => $count,
            ];
        }

        // Métricas generales de engagement
        $totalOracionesDisponibles = Oracion::count();
        $totalUsuariosOrando = OracionUsuario::distinct('people_id')->count('people_id');
        $totalOracionesCompletadas = OracionUsuario::whereNotNull('completada_at')->count();
        $totalOracionesIniciadas = OracionUsuario::count();
        $tasaCompletadoGlobal = $totalOracionesIniciadas > 0
            ? round(($totalOracionesCompletadas / $totalOracionesIniciadas) * 100, 2)
            : 0;

        // Oraciones premium vs gratuitas (engagement)
        $oracionesPremiumCompletadas = OracionUsuario::whereNotNull('completada_at')
            ->whereHas('oracion', function ($query) {
                $query->where('es_premium', true);
            })->count();

        $oracionesGratuitasCompletadas = OracionUsuario::whereNotNull('completada_at')
            ->whereHas('oracion', function ($query) {
                $query->where('es_premium', false);
            })->count();

        return Inertia::render('Admin/Content', [
            'oraciones' => $oraciones,
            'oracionesPorSemana' => $oracionesPorSemana,
            'metrics' => [
                'totalOracionesDisponibles' => $totalOracionesDisponibles,
                'totalUsuariosOrando' => $totalUsuariosOrando,
                'totalOracionesCompletadas' => $totalOracionesCompletadas,
                'totalOracionesIniciadas' => $totalOracionesIniciadas,
                'tasaCompletadoGlobal' => $tasaCompletadoGlobal,
                'oracionesPremiumCompletadas' => $oracionesPremiumCompletadas,
                'oracionesGratuitasCompletadas' => $oracionesGratuitasCompletadas,
            ],
        ]);
    }

    /**
     * Analytics detallados de abandono de encuesta
     * Muestra drop-off por paso, preguntas problemáticas, y métricas de engagement
     *
     * @return \Inertia\Response
     */
    public function encuestaAnalytics()
    {
        // 1. Usuarios por estado
        $porEstado = EncuestaProgreso::select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->get()
            ->pluck('total', 'estado');

        $totalRegistrados = People::all()->count();
        $sinIniciar = $totalRegistrados - EncuestaProgreso::all()->count();

        // 2. Drop-off por paso (usuarios en cada paso que NO avanzaron)
        $dropoffPorPaso = [];
        for ($paso = 1; $paso <= 4; $paso++) {
            $enPaso = EncuestaProgreso::where('paso_actual', $paso)
                ->where('completada', false)
                ->count();

            $dropoffPorPaso[] = [
                'paso' => $paso,
                'abandonos' => $enPaso,
            ];
        }

        // 3. Preguntas con mayor abandono (última pregunta vista en abandonos)
        $preguntasProblematicas = EncuestaProgreso::select('ultima_pregunta_vista', DB::raw('count(*) as abandonos'))
            ->where('completada', false)
            ->whereNotNull('ultima_pregunta_vista')
            ->groupBy('ultima_pregunta_vista')
            ->orderBy('abandonos', 'desc')
            ->limit(5)
            ->get();

        // 4. High intent vs low intent
        $conInteraccion = EncuestaProgreso::whereNotNull('respuestas_parciales')
            ->whereRaw('JSON_LENGTH(respuestas_parciales) > 0')
            ->where('completada', false)
            ->count();

        $sinInteraccion = $totalRegistrados - EncuestaProgreso::whereRaw('JSON_LENGTH(respuestas_parciales) > 0')->count();

        // 5. Usuarios completados
        $completadas = EncuestaProgreso::where('completada', true)->count();

        return Inertia::render('Admin/EncuestaAnalytics', [
            'metrics' => [
                'totalRegistrados' => $totalRegistrados,
                'sinIniciar' => $sinIniciar,
                'enProgreso' => $porEstado['en_progreso'] ?? 0,
                'completadas' => $completadas,
                'tasaCompletado' => $totalRegistrados > 0 ? round(($completadas / $totalRegistrados) * 100, 2) : 0,
            ],
            'engagement' => [
                'conInteraccion' => $conInteraccion,
                'sinInteraccion' => $sinInteraccion,
            ],
            'dropoffPorPaso' => $dropoffPorPaso,
            'preguntasProblematicas' => $preguntasProblematicas,
        ]);
    }

    /**
     * Calcula métricas básicas de abandono de encuesta
     * Usado en el funnel principal
     *
     * @return array
     */
    public function getEncuestaDropoffMetrics()
    {
        $totalRegistrados = People::all()->count();
        $iniciaron = EncuestaProgreso::count();
        $completaron = EncuestaProgreso::where('completada', true)->count();

        // Drop-off por paso
        $abandonosPorPaso = [];
        for ($paso = 1; $paso <= 4; $paso++) {
            $abandonos = EncuestaProgreso::where('paso_actual', $paso)
                ->where('completada', false)
                ->count();

            $abandonosPorPaso[$paso] = $abandonos;
        }

        return [
            'totalRegistrados' => $totalRegistrados,
            'iniciaron' => $iniciaron,
            'completaron' => $completaron,
            'abandonosPorPaso' => $abandonosPorPaso,
            'tasaInicio' => $totalRegistrados > 0 ? round(($iniciaron / $totalRegistrados) * 100, 2) : 0,
            'tasaCompletado' => $iniciaron > 0 ? round(($completaron / $iniciaron) * 100, 2) : 0,
        ];
    }
}
