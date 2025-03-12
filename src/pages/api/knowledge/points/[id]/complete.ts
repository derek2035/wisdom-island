import { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { KnowledgePoint } from '@/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' })
  }

  try {
    // 更新知识点状态
    await query(`
      UPDATE knowledge_points
      SET completed = true,
      completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id])

    // 获取更新后的知识点
    const [point] = await query(`
      SELECT 
        kp.*,
        kc.name as category_name
      FROM knowledge_points kp
      LEFT JOIN knowledge_categories kc ON kp.category_id = kc.id
      WHERE kp.id = ?
    `, [id]) as KnowledgePoint[]

    if (!point) {
      return res.status(404).json({ 
        success: false,
        message: '未找到知识点',
        data: null
      })
    }

    res.status(200).json({ 
      success: true,
      data: point
    })
  } catch (error) {
    console.error('完成知识点失败:', error)
    res.status(500).json({ 
      success: false,
      message: '完成知识点失败',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}