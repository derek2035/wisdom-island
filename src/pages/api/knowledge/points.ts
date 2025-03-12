import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const points = await prisma.knowledgePoint.findMany({
      include: {
        category: true,
        parent: true,
        children: true
      },
      orderBy: [
        { category_id: 'asc' },
        { order_index: 'asc' }
      ]
    })

    return res.status(200).json({
      success: true,
      data: points
    })
  } catch (error) {
    console.error('Error fetching knowledge points:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch knowledge points'
    })
  }
} 