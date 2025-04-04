"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchApiData, type APIData, type SensorHistory } from "@/lib/api"
import { RefreshCw } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

// Meses para las gráficas
const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderColor: string | string[]
    borderWidth?: number
  }>
}

export default function EstadisticasPage() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [apiData, setApiData] = useState<APIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar datos de la API
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
  }, [])

  // Determinar colores basados en el tema
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark")
  const textColor = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

  // Opciones comunes para las gráficas
  const commonOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        color: textColor,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  }

  // Datos para la gráfica de líneas (Temperatura y Humedad)
  const temperaturaActual = apiData?.sensores?.temperatura ?? 0
  const humedadActual = apiData?.sensores?.humedad ?? 0
  const lluviaActual = apiData?.sensores?.lluvia ?? 0
  const solActual = apiData?.sensores?.sol ?? 0

  // Create historical data using the current values
  const createHistoricalData = (currentValue: number, variance = 5) => {
    return meses.map((_, index) => {
      // Create some variation around the current value
      const variation = (Math.random() - 0.5) * variance
      return Math.max(0, currentValue + variation)
    })
  }

  const temperaturas = createHistoricalData(temperaturaActual)
  const humedades = createHistoricalData(humedadActual, 10)
  const lluvias = createHistoricalData(lluviaActual, 15)
  const solHistorial = createHistoricalData(solActual, 10)

  const lineData: ChartData = {
    labels: meses,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperaturas,
        borderColor: "#0088FE",
        backgroundColor: "rgba(0, 136, 254, 0.5)",
        borderWidth: 1,
      },
      {
        label: "Humedad (%)",
        data: humedades,
        borderColor: "#00C49F",
        backgroundColor: "rgba(0, 196, 159, 0.5)",
        borderWidth: 1,
      },
    ],
  }

  const barData: ChartData = {
    labels: meses,
    datasets: [
      {
        label: "Lluvia (mm)",
        data: lluvias,
        backgroundColor: "rgba(0, 136, 254, 0.7)",
        borderColor: "#0088FE",
        borderWidth: 1,
      },
    ],
  }

  // Datos para la gráfica de pie (Intensidad del Sol)
  const solRanges = [
    { label: "Bajo (0-20 W/m²)", max: 20, color: "#FFD700" }, // Amarillo claro
    { label: "Medio (20-40 W/m²)", max: 40, color: "#FFA500" }, // Naranja
    { label: "Alto (40-60 W/m²)", max: 60, color: "#FF4500" }, // Naranja oscuro
    { label: "Muy Alto (60-80 W/m²)", max: 80, color: "#FF0000" }, // Rojo
    { label: "Extremo (>80 W/m²)", max: 100, color: "#8B0000" }, // Rojo oscuro
  ]

  // Calcular los valores para cada rango
  const solDataValues = solRanges.map(range => {
    if (solActual <= range.max) {
      return solActual
    }
    return range.max
  })

  // Calcular el total para normalizar los porcentajes
  const total = solDataValues.reduce((sum, value) => sum + value, 0)
  const normalizedValues = solDataValues.map(value => (value / total) * 100)

  const solData: ChartData = {
    labels: solRanges.map(range => range.label),
    datasets: [
      {
        label: "Intensidad del Sol",
        data: normalizedValues,
        backgroundColor: solRanges.map(range => range.color),
        borderColor: solRanges.map(range => range.color),
        borderWidth: 1,
      },
    ],
  }

  // Opciones específicas para el gráfico de sol
  const solOptions: ChartOptions<any> = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins?.title,
        text: "Intensidad del Sol (W/m²)",
      },
      legend: {
        position: "right" as const,
        labels: {
          color: textColor,
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Estadísticas</h1>
        <Button
          onClick={loadData}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualizar datos
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4">
            <CardTitle>Temperatura</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Line
              data={lineData}
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    ...commonOptions.plugins?.title,
                    text: "Temperatura",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-900/20 p-4">
            <CardTitle>Humedad</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Line
              data={lineData}
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    ...commonOptions.plugins?.title,
                    text: "Humedad",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20 p-4">
            <CardTitle>Lluvia</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Bar
              data={barData}
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    ...commonOptions.plugins?.title,
                    text: "Lluvia",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="bg-orange-50 dark:bg-orange-900/20 p-4">
            <CardTitle>Intensidad del Sol</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[400px] w-full">
              <Pie
                data={solData}
                options={solOptions}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
