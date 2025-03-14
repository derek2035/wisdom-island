import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query

  try {
    const knowledgePoint = await prisma.knowledgePoint.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        id: true,
        title: true
      }
    })

    if (!knowledgePoint) {
      return res.status(404).json({ message: 'Knowledge point not found' })
    }

    return res.status(200).json(knowledgePoint)
  } catch (error) {
    console.error('Error fetching knowledge point:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 