import AdminLayout from '@/Layouts/AdminLayout';

export default function EncuestaAnalytics({ metrics, engagement, dropoffPorPaso, preguntasProblematicas }) {
    return (
        <AdminLayout title="Encuesta">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* KPI cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Registrados</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.totalRegistrados}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Sin iniciar</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.sinIniciar}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">En progreso</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.enProgreso}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm font-medium text-gray-600">Completadas</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.completadas}</p>
                        <p className="text-sm text-gray-600 mt-1">Tasa: {metrics.tasaCompletado}%</p>
                    </div>
                </div>

                {/* Engagement */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-600">Con interacción</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{engagement.conInteraccion}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-600">Sin interacción</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{engagement.sinInteraccion}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Drop-off por paso</h2>
                        <div className="space-y-3">
                            {dropoffPorPaso.map((row) => (
                                <div key={row.paso} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                                    <div className="text-sm font-medium text-gray-800">Paso {row.paso}</div>
                                    <div className="text-sm font-semibold text-gray-900">{row.abandonos}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Problem questions */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Preguntas con más abandonos</h2>
                        <p className="text-sm text-gray-600 mt-1">Top 5 por última pregunta vista</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pregunta
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Abandonos
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {preguntasProblematicas?.length ? (
                                    preguntasProblematicas.map((p) => (
                                        <tr key={p.ultima_pregunta_vista} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {p.ultima_pregunta_vista}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                                                {p.abandonos}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-10 text-center text-sm text-gray-500">
                                            Sin datos suficientes
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
