import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const parcelas = await prisma.parcela.findMany({
      include: {
        sensor: {
          include: {
            historial: true
          }
        }
      }
    })

    return Response.json(parcelas.map(parcela => ({
      ...parcela,
      sensor: {
        ...parcela.sensor,
        historial: parcela.sensor?.historial?.map(h => ({
          ...h,
          timestamp: new Date(h.timestamp).toISOString()
        })) || []
      }
    })))
  } catch (error) {
    console.error('Error fetching parcelas:', error)
    return Response.json({ error: 'Failed to fetch parcelas' }, { status: 500 })
  }
}
