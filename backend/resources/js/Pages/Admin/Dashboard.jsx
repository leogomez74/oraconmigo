import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ metrics }) {
    return (
        <AdminLayout title="Dashboard">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total de usuarios */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {metrics.totalUsers}
                                </p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            <span className="text-green-600 font-medium">+{metrics.todayUsers}</span> hoy
                        </div>
                    </div>

                    {/* Usuarios activos */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {metrics.activeUsers}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            Con actividad reciente
                        </div>
                    </div>

                    {/* Encuestas completadas */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Encuestas</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {metrics.completedSurveys}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            Completadas
                        </div>
                    </div>

                    {/* Usuarios premium */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Usuarios Premium</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {metrics.premiumUsers}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            {metrics.freeUsers} gratuitos
                        </div>
                    </div>
                </div>

                {/* Métricas de tiempo */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Registros por período</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border-l-4 border-indigo-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Última semana</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.weekUsers}
                            </p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Último mes</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.monthUsers}
                            </p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Tasa de conversión (encuesta)</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.totalUsers > 0
                                    ? Math.round((metrics.completedSurveys / metrics.totalUsers) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Métricas de Biblia */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Lectura de Biblia (Contenido Gratuito)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="border-l-4 border-purple-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Usuarios leyendo</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.bibleReaders}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {metrics.totalUsers > 0
                                    ? Math.round((metrics.bibleReaders / metrics.totalUsers) * 100)
                                    : 0}% del total
                            </p>
                        </div>
                        <div className="border-l-4 border-pink-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Lecturas totales</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.totalBibleReadings}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Capítulos leídos
                            </p>
                        </div>
                        <div className="border-l-4 border-teal-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Esta semana</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.weekBibleReadings}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Lecturas recientes
                            </p>
                        </div>
                    </div>

                    {/* Top libros más leídos */}
                    {metrics.topBooks && metrics.topBooks.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Top 5 Libros Más Leídos</h3>
                            <div className="space-y-2">
                                {metrics.topBooks.map((book, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                                            <span className="text-sm text-gray-700">{book.book}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{book.total} lecturas</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Métricas de Oraciones Guiadas */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Oraciones Guiadas (Contenido Premium)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="border-l-4 border-orange-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Oraciones disponibles</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.totalOracionesDisponibles}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {metrics.oracionesGratuitas} gratuitas / {metrics.oracionesPremium} premium
                            </p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Oraciones completadas</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.totalOracionesCompletadas}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Total de completados
                            </p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Usuarios orando</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.usuariosConOracionesCompletadas}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {metrics.totalUsers > 0
                                    ? Math.round((metrics.usuariosConOracionesCompletadas / metrics.totalUsers) * 100)
                                    : 0}% del total
                            </p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Progreso promedio</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {metrics.progresoPromedio}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                De oraciones iniciadas
                            </p>
                        </div>
                    </div>

                    {/* Top oraciones más populares */}
                    {metrics.oracionesPopulares && metrics.oracionesPopulares.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Top 5 Oraciones Más Completadas</h3>
                            <div className="space-y-2">
                                {metrics.oracionesPopulares.map((oracion, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">{oracion.titulo}</span>
                                                <span className="text-xs text-gray-500 ml-2">({oracion.categoria})</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{oracion.total} completadas</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Distribución por categoría */}
                    {metrics.oracionesPorCategoria && metrics.oracionesPorCategoria.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Distribución por Categoría</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {metrics.oracionesPorCategoria.map((cat, index) => (
                                    <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded px-3 py-2 border border-orange-200">
                                        <p className="text-xs font-medium text-gray-600">{cat.categoria}</p>
                                        <p className="text-lg font-bold text-orange-600">{cat.total}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Nota informativa */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> Las métricas de suscripciones premium e ingresos se mostrarán cuando se implemente el sistema de monetización.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
