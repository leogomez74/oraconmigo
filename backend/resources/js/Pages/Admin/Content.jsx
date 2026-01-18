import AdminLayout from '@/Layouts/AdminLayout';

export default function Content({ oraciones, oracionesPorSemana, metrics }) {
    return (
        <AdminLayout title="Contenido">
            <div className="max-w-7xl mx-auto">
                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Oraciones Completadas</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {metrics.totalOracionesCompletadas}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            De {metrics.totalOracionesIniciadas} iniciadas
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Usuarios Orando</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {metrics.totalUsuariosOrando}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            Con oraciones completadas
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tasa de Completado</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {metrics.tasaCompletadoGlobal}%
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            Conversión iniciada → completada
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Oraciones Disponibles</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {metrics.totalOracionesDisponibles}
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            Total en catálogo
                        </div>
                    </div>
                </div>

                {/* Engagement Premium vs Gratuito */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement: Premium vs Gratuito</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Oraciones Premium Completadas</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">
                                {metrics.oracionesPremiumCompletadas}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {metrics.totalOracionesCompletadas > 0
                                    ? Math.round((metrics.oracionesPremiumCompletadas / metrics.totalOracionesCompletadas) * 100)
                                    : 0}% del total
                            </p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <p className="text-sm font-medium text-gray-600">Oraciones Gratuitas Completadas</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {metrics.oracionesGratuitasCompletadas}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {metrics.totalOracionesCompletadas > 0
                                    ? Math.round((metrics.oracionesGratuitasCompletadas / metrics.totalOracionesCompletadas) * 100)
                                    : 0}% del total
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline de oraciones completadas */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Oraciones Completadas (Últimas 8 Semanas)</h2>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {oracionesPorSemana.map((semana, index) => {
                            const maxValue = Math.max(...oracionesPorSemana.map(s => s.total), 1);
                            const height = (semana.total / maxValue) * 100;

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center justify-end">
                                    <div className="relative w-full flex flex-col items-center">
                                        <span className="text-xs font-semibold text-gray-700 mb-1">
                                            {semana.total}
                                        </span>
                                        <div
                                            className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t transition-all hover:from-indigo-600 hover:to-indigo-500"
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{semana.semana}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tabla detallada de oraciones */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Estadísticas Detalladas por Oración</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Oración
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Iniciadas
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Completadas
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tasa Completado
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Progreso Promedio
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {oraciones.length > 0 ? (
                                    oraciones.map((oracion) => (
                                        <tr key={oracion.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {oracion.titulo}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {oracion.duracion} min
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-700">
                                                    {oracion.categoria}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {oracion.es_premium ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Premium
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Gratis
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                {oracion.total_iniciadas}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-green-600">
                                                {oracion.total_completadas}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center">
                                                        <span className={`text-sm font-bold ${
                                                            oracion.tasa_completado >= 80 ? 'text-green-600' :
                                                            oracion.tasa_completado >= 50 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                        }`}>
                                                            {oracion.tasa_completado}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-indigo-600 h-2 rounded-full"
                                                            style={{ width: `${oracion.progreso_promedio}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="ml-2 text-xs text-gray-600">
                                                        {oracion.progreso_promedio}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                                            No hay oraciones disponibles
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
