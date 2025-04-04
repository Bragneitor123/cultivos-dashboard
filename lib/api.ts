import prisma from './db-server'

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

interface SensorData {
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
  sensor: SensorData
  latitud: number
  longitud: number
  createdAt: Date
  updatedAt: Date
}

interface APIData {
  sensores: SensorData
  parcelas: Parcela[]
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

interface ParcelaAPI {
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

export async function fetchApiData(): Promise<APIData> {
  try {
    const response = await fetch('https://moriahmkt.com/iotapp/updated/')
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching sensor data:', error)
    throw error
  }
}

export async function fetchSensoresData(): Promise<SensorData> {
  try {
    const response = await fetch('https://moriahmkt.com/iotapp/updated/')
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const data = await response.json()
    return data.sensores
  } catch (error) {
    console.error('Error fetching sensor data:', error)
    throw error
  }
}

export async function fetchParcelasData(): Promise<Parcela[]> {
  try {
    const response = await fetch('https://moriahmkt.com/iotapp/updated/')
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const data = await response.json()
    return data.parcelas
  } catch (error) {
    console.error('Error fetching parcel data:', error)
    throw error
  }
}

export async function addSensorData(sensorData: {
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
  parcelaId?: number
}): Promise<SensorData> {
  try {
    const response = await fetch('https://moriahmkt.com/iotapp/updated/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sensorData),
    })
    if (!response.ok) {
      throw new Error('Failed to add sensor data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error adding sensor data:', error)
    throw error
  }
}

export async function updateSensorData(sensorId: number, sensorData: {
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
}): Promise<SensorData> {
  try {
    const response = await fetch(`https://moriahmkt.com/iotapp/updated/${sensorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sensorData),
    })
    if (!response.ok) {
      throw new Error('Failed to update sensor data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating sensor data:', error)
    throw error
  }
}

export type { SensorData, Parcela, APIData, Sensor, ParcelaAPI, SensorHistory }
