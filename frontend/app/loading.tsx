export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
        </div>

        {/* Texto opcional */}
        <p className="text-sm text-gray-500 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
