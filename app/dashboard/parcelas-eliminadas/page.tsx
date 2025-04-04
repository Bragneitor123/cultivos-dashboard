"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchParcelasData, type Parcela } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Simulación de parcelas eliminadas
const simularParcelasEliminadas = (parcelas: Parcela[]) => {
  // Crear copias de las parcelas y marcarlas como eliminadas
  return parcelas.map((parcela) => ({
    id: parcela.id + 100, // Para evitar conflictos con IDs existentes
    nombre: parcela.nombre,
    ubicacion: parcela.ubicacion,
    responsable: parcela.responsable,
    tipo_cultivo: parcela.tipoCultivo,
    fechaEliminacion: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    motivo: ["Baja productividad", "Contaminación", "Fusión con otra parcela", "Cambio de uso"][
      Math.floor(Math.random() * 4)
    ],
  }))
}

export default function ParcelasEliminadasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [parcelasEliminadas, setParcelasEliminadas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const cargarParcelas = async () => {
    try {
      setRefreshing(true)
      const parcelas = await fetchParcelasData()
      // Simular parcelas eliminadas basadas en las parcelas reales
      setParcelasEliminadas(simularParcelasEliminadas(parcelas))
    } catch (err) {
      console.error("Error al cargar datos:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    cargarParcelas()
  }, [])

  const filteredParcelas = parcelasEliminadas.filter(
    (parcela) =>
      parcela.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcela.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcela.motivo?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Parcelas Eliminadas</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={cargarParcelas}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualizar datos
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4">
          <CardTitle className="text-lg">Listado de Parcelas Eliminadas</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar parcela..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="transition-all hover:bg-blue-100 dark:hover:bg-blue-900"
              onClick={cargarParcelas}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Actualizar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading && parcelasEliminadas.length === 0 ? (
              <div className="p-4">
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Fecha de Eliminación</TableHead>
                    <TableHead>Motivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParcelas.length > 0 ? (
                    filteredParcelas.map((parcela) => (
                      <TableRow
                        key={parcela.id}
                        className="transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                      >
                        <TableCell className="font-medium">{parcela.id}</TableCell>
                        <TableCell>{parcela.nombre}</TableCell>
                        <TableCell>{parcela.ubicacion}</TableCell>
                        <TableCell>{parcela.fechaEliminacion}</TableCell>
                        <TableCell>{parcela.motivo}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

