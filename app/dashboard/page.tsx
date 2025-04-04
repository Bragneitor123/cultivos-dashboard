"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplets, CloudRain, Sun, RefreshCw } from "lucide-react"
import dynamic from "next/dynamic"
import { FallbackMap } from "@/components/fallback-map"
import { fetchApiData, Parcela, type APIData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import APIDashboard from "./api-dashboard"

// Importación dinámica del componente de mapa para evitar errores de SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <FallbackMap className="aspect-[16/9]" />,
})

export default function DashboardPage() {
  const [apiData, setApiData] = useState<APIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setRefreshing(true)
      const data = await fetchApiData()
      setApiData(data)
    } catch (err) {
      console.error("Error al cargar datos:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()

    // Actualizar datos cada 30 segundos
    const interval = setInterval(loadData, 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Datos actuales de los sensores
  const temperaturaActual = apiData?.sensores?.temperatura ?? 0
  const humedadActual = apiData?.sensores?.humedad ?? 0
  const lluviaActual = apiData?.sensores?.lluvia ?? 0
  const solActual = apiData?.sensores?.sol ?? 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualizar datos
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Mapa de Ubicaciones</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-[16/9] w-full">
              {loading && !apiData ? (
                <FallbackMap className="aspect-[16/9]" />
              ) : (
                <MapComponent ubicaciones={apiData?.parcelas || []} onPlotClick={() => {}} />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-3">
                <CardTitle className="flex items-center text-sm md:text-base">
                  <Thermometer className="mr-2 h-4 w-4" />
                  Temperatura
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-center">
                {loading ? (
                  <Skeleton className="h-8 w-16 mx-auto" />
                ) : (
                  <p className="text-3xl font-bold">{temperaturaActual}°C</p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-3">
                <CardTitle className="flex items-center text-sm md:text-base">
                  <Droplets className="mr-2 h-4 w-4" />
                  Humedad
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-center">
                {loading ? (
                  <Skeleton className="h-8 w-16 mx-auto" />
                ) : (
                  <p className="text-3xl font-bold">{humedadActual}%</p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-3">
                <CardTitle className="flex items-center text-sm md:text-base">
                  <CloudRain className="mr-2 h-4 w-4" />
                  Lluvia
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-center">
                {loading ? (
                  <Skeleton className="h-10 w-10 mx-auto rounded-full" />
                ) : (
                  <p className="text-3xl font-bold">{lluviaActual} mm</p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-3">
                <CardTitle className="flex items-center text-sm md:text-base">
                  <Sun className="mr-2 h-4 w-4" />
                  Intensidad del sol
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-center">
                {loading ? (
                  <Skeleton className="h-10 w-10 mx-auto rounded-full" />
                ) : (
                  <p className="text-3xl font-bold">{solActual} %</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Nueva sección para el dashboard de la API */}
      <div className="mt-6">
        <APIDashboard />
      </div>
    </div>
  ) 
}
