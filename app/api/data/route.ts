import { prisma } from '../../../lib/prisma'

interface SensorHistory {
  id: number
  sensorId: number
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
  timestamp: Date
  createdAt: Date
  updatedAt: Date
}

interface Sensor {
  id: number
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
  historial: SensorHistory[]
  createdAt: Date
  updatedAt: Date
}

interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipoCultivo: string
  ultimoRiego: Date
  sensorId: number
  sensor: Sensor
  latitud: number
  longitud: number
  createdAt: Date
  updatedAt: Date
}

interface APIData {
  sensores: Sensor
  parcelas: Parcela[]
}

export async function GET() {
  try {
    const response = await fetch('https://moriahmkt.com/iotapp/updated/')
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Error fetching API data:', error)
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
