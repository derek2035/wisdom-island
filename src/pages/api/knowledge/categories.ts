import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const categories = await prisma.knowledgeCategory.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    return res.status(200).json({ 
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch categories'
    })
  }
}