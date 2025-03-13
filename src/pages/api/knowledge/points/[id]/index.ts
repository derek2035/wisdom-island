import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { KnowledgePoint } from '@/types'

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
        children: true,
        progress: {
          where: {
            user_id: "1" // 暂时硬编码用户ID
          },
          select: {
            completed_times: true,
            last_completed_at: true
          }
        }
      }
    })

    if (!point) {
      return res.status(404).json({ 
        success: false,
        message: `未找到ID为 ${id} 的知识点`,
        data: null
      })
    }

    // 转换数据格式
    const formattedPoint = {
      id: point.id,
      title: point.title,
      level: point.level,
      grade: point.grade,
      content: point.content,
      order_index: point.order_index,
      category_id: point.category_id,
      parent_id: point.parent_id,
      objective: point.objective || `掌握${point.title}的核心概念和应用`,
      keyPoints: point.keyPoints as string[],
      category: {
        id: point.category.id,
        name: point.category.name
      },
      isCompleted: point.progress.length > 0,
      completionCount: point.progress[0]?.completed_times || 0,
      lastCompletedAt: point.progress[0]?.last_completed_at || null
    }

    res.status(200).json({ 
      success: true,
      data: formattedPoint
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