import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: '方法不允许',
      data: null
    })
  }

  try {
    const point = await prisma.knowledgePoint.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        category: true,
        parent: true,
        children: true
      }
    })

    if (!point) {
      return res.status(404).json({ 
        success: false,
        message: `未找到ID为 ${id} 的知识点`,
        data: null
      })
    }

    res.status(200).json({ 
      success: true,
      data: point
    })
  } catch (error) {
    console.error('获取知识点详情失败:', error)
    res.status(500).json({ 
      success: false,
      message: '获取知识点详情失败',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}