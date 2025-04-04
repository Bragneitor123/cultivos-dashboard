"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MapComponent from "@/components/map-component"
import { fetchApiData, fetchParcelasData } from "@/lib/api"
import { Parcela } from "@/lib/api"

interface APIData {
  plots: Parcela[]
}

export default function APIDashboard() {
  const [data, setData] = useState<APIData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlot, setSelectedPlot] = useState<Parcela | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetchApiData()
      setData({
        plots: response.parcelas
      })
    } catch (err) {
      setError("Error al cargar los datos de la API")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!data) {
    return <div className="text-gray-500">Cargando...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full md:col-span-1">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Parcelas</h2>
            <div className="grid gap-4">
              {data.plots.map((plot) => (
                <Card key={plot.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{plot.nombre}</h3>
                      <p className="text-gray-600">{plot.ubicacion}</p>
                      <p className="text-gray-600">{plot.tipoCultivo}</p>
                      <p className="text-gray-600">Último riego: {new Date(plot.ultimoRiego).toLocaleString()}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlot(plot)}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <div className="space-y-4">
            {selectedPlot && (
              <div className="bg-white rounded-lg shadow-md p-6 relative">
                <button
                  onClick={() => setSelectedPlot(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Cerrar detalles"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-xl font-bold mb-4 text-black">Detalles de la Parcela</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 p-4 rounded text-black">
                    <h4 className="font-semibold">Temperatura</h4>
                    <p>{selectedPlot.sensor.temperatura}°C</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded text-black">
                    <h4 className="font-semibold">Humedad</h4>
                    <p>{selectedPlot.sensor.humedad}%</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded text-black">
                    <h4 className="font-semibold">Lluvia</h4>
                    <p>{selectedPlot.sensor.lluvia}</p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded text-black">
                    <h4 className="font-semibold">Intensidad del sol</h4>
                    <p>{selectedPlot.sensor.sol}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
