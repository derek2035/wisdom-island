import { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' })
  }

  try {
    // 先删除知识点数据
    await query('DELETE FROM knowledge_points')
    // 再删除分类数据
    await query('DELETE FROM knowledge_categories')

    // 插入新的分类
    const categories = [
      {
        name: '数与代数',
        description: '包括基础数感、数值扩展、抽象运算和高阶代数等内容',
        order_index: 1
      },
      {
        name: '空间与几何',
        description: '包括基础认知、测量技能、空间思维和几何证明等内容',
        order_index: 2
      },
      {
        name: '统计与概率',
        description: '包括数据收集、概率基础和数据分析等内容',
        order_index: 3
      },
      {
        name: '综合应用',
        description: '包括基础场景、实际问题和数学建模等内容',
        order_index: 4
      }
    ]

    for (const category of categories) {
      await query(
        'INSERT INTO knowledge_categories (name, description, order_index) VALUES (?, ?, ?)',
        [category.name, category.description, category.order_index]
      )
    }

    res.status(200).json({ 
      success: true,
      message: '知识点分类初始化成功',
      data: categories
    })
  } catch (error) {
    console.error('初始化知识点分类失败:', error)
    res.status(500).json({ 
      success: false,
      message: '初始化知识点分类失败',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}