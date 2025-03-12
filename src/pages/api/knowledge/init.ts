import { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/db'

interface Category {
  id: number
  name: string
  description: string
}

interface KnowledgePoint {
  title: string
  level: number
  grade: number
  category_id: number
  parent_id?: number | null
  order_index: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' })
  }

  try {
    // 创建表
    await query(`
      CREATE TABLE IF NOT EXISTS knowledge_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS knowledge_points (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id INT,
        parent_id INT,
        title VARCHAR(100) NOT NULL,
        level INT NOT NULL,
        grade INT NOT NULL,
        order_index INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES knowledge_categories(id),
        FOREIGN KEY (parent_id) REFERENCES knowledge_points(id)
      )
    `)

    // 清空现有数据
    await query('DELETE FROM knowledge_points')
    await query('DELETE FROM knowledge_categories')

    // 插入知识点分类
    const categories = [
      { name: '数与代数', description: '包括数的认识、运算、代数式等' },
      { name: '图形与几何', description: '包括图形的认识、测量、变换等' },
      { name: '统计与概率', description: '包括数据的收集、整理、分析等' }
    ]

    for (const category of categories) {
      await query(
        'INSERT INTO knowledge_categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      )
    }

    // 获取分类ID
    const categoryRows = await query('SELECT id, name FROM knowledge_categories') as Category[]
    const categoryMap = new Map(categoryRows.map(row => [row.name, row.id]))

    // 插入知识点数据
    const points: KnowledgePoint[] = [
      // 数与代数
      {
        title: '数的认识',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数') || 0,
        parent_id: null,
        order_index: 1
      },
      {
        title: '数的运算',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数') || 0,
        parent_id: null,
        order_index: 2
      },
      {
        title: '数的认识',
        level: 2,
        grade: 1,
        category_id: categoryMap.get('数与代数') || 0,
        parent_id: 1,
        order_index: 1
      },
      {
        title: '数的运算',
        level: 2,
        grade: 1,
        category_id: categoryMap.get('数与代数') || 0,
        parent_id: 2,
        order_index: 1
      },
      // 图形与几何
      {
        title: '图形的认识',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('图形与几何') || 0,
        parent_id: null,
        order_index: 1
      },
      {
        title: '图形的测量',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('图形与几何') || 0,
        parent_id: null,
        order_index: 2
      },
      {
        title: '图形的认识',
        level: 2,
        grade: 1,
        category_id: categoryMap.get('图形与几何') || 0,
        parent_id: 5,
        order_index: 1
      },
      {
        title: '图形的测量',
        level: 2,
        grade: 1,
        category_id: categoryMap.get('图形与几何') || 0,
        parent_id: 6,
        order_index: 1
      }
    ]

    for (const point of points) {
      await query(
        `INSERT INTO knowledge_points 
        (title, level, grade, category_id, parent_id, order_index) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [point.title, point.level, point.grade, point.category_id, point.parent_id, point.order_index]
      )
    }

    res.status(200).json({ message: '知识点初始化成功' })
  } catch (error) {
    console.error('初始化知识点失败:', error)
    res.status(500).json({ 
      message: '初始化知识点失败',
      error: error instanceof Error ? error.message : String(error)
    })
  }
} 