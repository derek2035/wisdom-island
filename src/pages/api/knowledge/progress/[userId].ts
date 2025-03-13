import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { userId } = req.query

  try {
    const progress = await prisma.userKnowledgeProgress.findMany({
      where: {
        user_id: userId as string
      },
      include: {
        knowledge_point: true
      }
    })

    return res.status(200).json({
      success: true,
      data: progress
    })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user progress'
    })
  }
} 