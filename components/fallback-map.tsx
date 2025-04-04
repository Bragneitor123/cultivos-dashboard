import { MapPin } from "lucide-react"

interface FallbackMapProps {
  className?: string
}

export function FallbackMap({ className }: FallbackMapProps) {
  return (
    <div
      className={`relative w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center ${className}`}
    >
      <div className="text-center">
        <MapPin className="h-12 w-12 mx-auto text-blue-600 mb-2" />
        <p className="text-gray-600 dark:text-gray-300">Cargando mapa...</p>
      </div>

      {/* Simulación de marcadores */}
      <div className="absolute left-1/4 top-1/4">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute right-1/4 top-1/3">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/3">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

