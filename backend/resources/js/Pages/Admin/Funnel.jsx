export default function Funnel({ funnel }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Funnel de Conversión</h1>
                        <div className="flex gap-4">
                            <a
                                href="/admin/dashboard"
                                className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                                Dashboard
                            </a>
                            <a
                                href="/admin/users"
                                className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                                Usuarios
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Embudo de Conversión de Usuarios
                    </h2>

                    {/* Funnel Steps */}
                    <div className="space-y-4">
                        {funnel.steps.map((step, index) => {
                            const isLast = index === funnel.steps.length - 1;
                            const widthPercentage = step.rate;

                            // Colores para cada paso
                            const colors = [
                                'bg-indigo-500',
                                'bg-blue-500',
                                'bg-green-500',
                                'bg-yellow-500',
                            ];

                            return (
                                <div key={index}>
                                    {/* Paso del funnel */}
                                    <div className="flex items-center gap-4">
                                        {/* Número del paso */}
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                                            {index + 1}
                                        </div>

                                        {/* Barra de progreso */}
                                        <div className="flex-grow">
                                            <div className="mb-2 flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {step.name}
                                                </span>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {step.count}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        ({step.rate}%)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                                                <div
                                                    className={`h-full ${colors[index]} transition-all duration-500 flex items-center justify-end pr-2`}
                                                    style={{ width: `${widthPercentage}%` }}
                                                >
                                                    {widthPercentage > 15 && (
                                                        <span className="text-xs font-semibold text-white">
                                                            {step.count}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Flecha de conversión */}
                                    {!isLast && (
                                        <div className="flex items-center justify-center py-2">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Resumen de conversión */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-md font-semibold text-gray-900 mb-4">
                            Tasas de Conversión Entre Pasos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {funnel.steps.slice(1).map((step, index) => {
                                const prevStep = funnel.steps[index];
                                const conversionRate = prevStep.count > 0
                                    ? ((step.count / prevStep.count) * 100).toFixed(2)
                                    : 0;

                                return (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-600 mb-1">
                                            {prevStep.name} → {step.name}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {conversionRate}%
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Nota informativa */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> Los pasos "Primera Oración" y "Suscripción Premium" mostrarán datos reales cuando se implementen las funcionalidades de oraciones guiadas y sistema de pagos.
                        </p>
                    </div>
                </div>

                {/* Métricas adicionales */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-md font-semibold text-gray-900 mb-4">
                            Conversión Global
                        </h3>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-indigo-600">
                                {funnel.steps[0].count > 0
                                    ? ((funnel.steps[funnel.steps.length - 1].count / funnel.steps[0].count) * 100).toFixed(2)
                                    : 0}%
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                De registro a suscripción
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-md font-semibold text-gray-900 mb-4">
                            Mayor Pérdida
                        </h3>
                        <div className="text-center">
                            {(() => {
                                let maxDropIndex = 0;
                                let maxDrop = 0;

                                funnel.steps.slice(1).forEach((step, index) => {
                                    const prevStep = funnel.steps[index];
                                    const drop = prevStep.count - step.count;
                                    if (drop > maxDrop) {
                                        maxDrop = drop;
                                        maxDropIndex = index;
                                    }
                                });

                                const stepName = funnel.steps[maxDropIndex].name + ' → ' + funnel.steps[maxDropIndex + 1].name;

                                return (
                                    <>
                                        <p className="text-4xl font-bold text-red-600">
                                            {maxDrop}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {stepName}
                                        </p>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
