export default function LoadingSpinner({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-yellow-500 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
        </div>

        {/* Texto personalizable */}
        <p className="text-sm text-gray-400 font-medium">{message}</p>
      </div>
    </div>
  );
}
