import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface KnowledgePoint {
  id?: number
  title: string
  level: number
  grade: number
  category_id: number
  parent_id: number | null
  order_index: number
  content: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' })
  }

  try {
    // 清空现有数据
    await prisma.knowledgePoint.deleteMany()
    await prisma.knowledgeCategory.deleteMany()

    // 创建分类
    const categories = await Promise.all([
      prisma.knowledgeCategory.create({ data: { name: '数与代数' } }),
      prisma.knowledgeCategory.create({ data: { name: '空间与几何' } }),
      prisma.knowledgeCategory.create({ data: { name: '统计与概率' } }),
      prisma.knowledgeCategory.create({ data: { name: '综合应用' } })
    ])

    const categoryMap = new Map(categories.map(c => [c.name, c.id]))

    // 定义父级知识点
    const parentPoints: KnowledgePoint[] = [
      // 数与代数
      {
        title: '数的认识',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: null,
        order_index: 1,
        content: '数的认识是数学学习的基础，包括数的概念、数的表示方法、数的分类等基本内容。通过具体的生活实例，帮助学生建立数的概念，理解数的意义，掌握数的读写方法。'
      },
      {
        title: '基础数感',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: null,
        order_index: 2,
        content: '基础数感是数学思维的重要基础，包括数的分解与组合、数的比较与排序、数的估算等能力。通过丰富的实践活动，培养学生的数感，提高数学思维能力。'
      },
      {
        title: '数值扩展',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: null,
        order_index: 3,
        content: '数值扩展是数学知识的重要延伸，包括小数、分数等数的概念及其运算。通过具体的生活实例，帮助学生理解这些数的意义，掌握其运算方法。'
      },
      {
        title: '运算定律',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: null,
        order_index: 4,
        content: '运算定律是数学运算的重要规则，包括加法交换律、乘法交换律、结合律、分配律等。通过具体例子，帮助学生理解这些定律，并能灵活运用。'
      },
      {
        title: '数量关系',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: null,
        order_index: 5,
        content: '数量关系是数学应用的重要内容，包括比、比例、正反比例等概念。通过实际问题，帮助学生理解这些关系，并能解决相关问题。'
      },
      {
        title: '抽象运算',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('数与代数')!,
        parent_id: null,
        order_index: 6,
        content: '抽象运算是对数学运算的深化，包括分数运算、负数运算等。通过具体例子，帮助学生掌握这些运算方法，提高运算能力。'
      },
      {
        title: '高阶代数',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: null,
        order_index: 7,
        content: '高阶代数是数学思维的提升，包括方程、函数等概念。通过实际问题，帮助学生理解这些概念，培养代数思维。'
      },

      // 空间与几何
      {
        title: '图形认知',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: null,
        order_index: 1,
        content: '图形认知是几何学习的基础，包括平面图形和立体图形的认识。通过观察和操作，帮助学生认识各种图形，理解其特征。'
      },
      {
        title: '基础认知',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: null,
        order_index: 2,
        content: '基础认知是对图形的基本认识，包括图形识别、位置关系等。通过实践活动，培养学生的空间观念。'
      },
      {
        title: '测量技能',
        level: 1,
        grade: 2,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: null,
        order_index: 3,
        content: '测量技能是几何应用的基础，包括长度、角度、面积、体积的测量。通过实践活动，培养学生的测量能力。'
      },
      {
        title: '图形运动',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: null,
        order_index: 4,
        content: '图形运动是几何变换的重要内容，包括轴对称、平移、旋转等。通过操作活动，帮助学生理解这些变换。'
      },
      {
        title: '空间思维',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: null,
        order_index: 5,
        content: '空间思维是几何思维的发展，包括立体图形、坐标等概念。通过实践活动，培养学生的空间想象能力。'
      },
      {
        title: '几何证明',
        level: 3,
        grade: 4,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: null,
        order_index: 6,
        content: '几何证明是几何思维的高级形式，包括三角形、平行四边形等图形的性质证明。通过推理活动，培养学生的逻辑思维能力。'
      },

      // 统计与概率
      {
        title: '数据收集',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: null,
        order_index: 1,
        content: '数据收集是统计学习的基础，包括数据的收集、整理和记录。通过实践活动，培养学生的数据意识。'
      },
      {
        title: '统计图表',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: null,
        order_index: 2,
        content: '统计图表是数据展示的重要方式，包括条形图、折线图、扇形图等。通过实践活动，帮助学生理解和使用这些图表。'
      },
      {
        title: '概率基础',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: null,
        order_index: 3,
        content: '概率基础是概率学习的基础，包括可能性、概率计算等概念。通过实践活动，帮助学生理解这些概念。'
      },
      {
        title: '数据分析',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: null,
        order_index: 4,
        content: '数据分析是统计应用的重要内容，包括趋势分析、数据预测等。通过实践活动，培养学生的数据分析能力。'
      },
      {
        title: '随机抽样',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: null,
        order_index: 5,
        content: '随机抽样是统计调查的重要方法，包括简单随机抽样、系统抽样、分层抽样等。通过实践活动，帮助学生理解这些方法。'
      },

      // 综合应用
      {
        title: '基础场景',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('综合应用')!,
        parent_id: null,
        order_index: 1,
        content: '基础场景是数学应用的基础，包括简单的数学问题解决。通过生活实例，帮助学生理解数学的应用。'
      },
      {
        title: '生活应用',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('综合应用')!,
        parent_id: null,
        order_index: 2,
        content: '生活应用是数学知识的具体应用，包括购物计算、时间计算等。通过实践活动，培养学生的应用能力。'
      },
      {
        title: '实际问题',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('综合应用')!,
        parent_id: null,
        order_index: 3,
        content: '实际问题是数学应用的重要内容，包括植树问题、行程问题等。通过实践活动，培养学生的解决问题的能力。'
      },
      {
        title: '数学建模',
        level: 3,
        grade: 4,
        category_id: categoryMap.get('综合应用')!,
        parent_id: null,
        order_index: 4,
        content: '数学建模是数学应用的高级形式，包括优化问题、经济模型等。通过实践活动，培养学生的建模能力。'
      },
      {
        title: '跨学科应用',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('综合应用')!,
        parent_id: null,
        order_index: 5,
        content: '跨学科应用是数学知识的综合应用，包括科学计算、体育数据等。通过实践活动，培养学生的综合应用能力。'
      }
    ]

    // 插入父级知识点
    const parentPointMap = new Map<string, number>()
    for (const point of parentPoints) {
      const result = await prisma.knowledgePoint.create({
        data: {
          title: point.title,
          level: point.level,
          grade: point.grade,
          category_id: point.category_id,
          parent_id: point.parent_id,
          order_index: point.order_index,
          content: point.content
        }
      })
      parentPointMap.set(point.title, result.id)
    }

    // 检查所有父级知识点是否存在
    const requiredParentPoints = [
      // 数与代数
      '数的认识', '基础数感', '数值扩展', '运算定律', '数量关系', '抽象运算', '高阶代数',
      // 空间与几何
      '图形认知', '基础认知', '测量技能', '图形运动', '空间思维', '几何证明',
      // 统计与概率
      '数据收集', '统计图表', '概率基础', '数据分析', '随机抽样',
      // 综合应用
      '基础场景', '生活应用', '实际问题', '数学建模', '跨学科应用'
    ]
    for (const point of requiredParentPoints) {
      if (!parentPointMap.has(point)) {
        throw new Error(`缺少必需的父级知识点: ${point}`)
      }
    }

    // 定义子知识点
    const childPoints: KnowledgePoint[] = [
      // 数的认识的子知识点
      {
        title: '十进制计数法',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数的认识')!,
        order_index: 1,
        content: '十进制计数法是最常用的计数方法，包括个位、十位、百位等位值的概念。通过具体例子，帮助学生理解位值，掌握数的读写方法。'
      },
      {
        title: '数的组成',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数的认识')!,
        order_index: 2,
        content: '数的组成是理解数的重要基础，包括数的分解与组合。通过实践活动，帮助学生理解数的结构，掌握数的组成方法。'
      },
      {
        title: '数的读写',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数的认识')!,
        order_index: 3,
        content: '数的读写是数学学习的基本技能，包括数的读法和写法。通过练习，帮助学生掌握数的读写方法。'
      },
      {
        title: '数的大小比较',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数的认识')!,
        order_index: 4,
        content: '数的大小比较是数学思维的重要基础，包括数的比较方法。通过实践活动，培养学生的比较能力。'
      },
      {
        title: '数的顺序',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数的认识')!,
        order_index: 5,
        content: '数的顺序是理解数的重要方面，包括数的排列和规律。通过实践活动，帮助学生理解数的顺序。'
      },

      // 运算定律的子知识点
      {
        title: '加法交换律',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('运算定律')!,
        order_index: 1,
        content: '加法交换律是加法运算的重要性质，表示加数的顺序可以交换。通过具体例子，帮助学生理解这个定律。'
      },
      {
        title: '乘法交换律',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('运算定律')!,
        order_index: 2,
        content: '乘法交换律是乘法运算的重要性质，表示乘数的顺序可以交换。通过具体例子，帮助学生理解这个定律。'
      },
      {
        title: '结合律',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('运算定律')!,
        order_index: 3,
        content: '结合律是运算的重要性质，包括加法和乘法的结合律。通过具体例子，帮助学生理解这个定律。'
      },
      {
        title: '分配律',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('运算定律')!,
        order_index: 4,
        content: '分配律是乘法对加法的分配性质。通过具体例子，帮助学生理解这个定律。'
      },
      {
        title: '运算顺序',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('运算定律')!,
        order_index: 5,
        content: '运算顺序是进行混合运算的重要规则。通过具体例子，帮助学生掌握运算顺序。'
      },

      // 数量关系的子知识点
      {
        title: '比的认识',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数量关系')!,
        order_index: 1,
        content: '比的认识是理解数量关系的重要概念，包括比的定义、比的表示方法等。通过实际问题，帮助学生理解比的概念。'
      },
      {
        title: '比的基本性质',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数量关系')!,
        order_index: 2,
        content: '比的基本性质是比的重要性质，包括比的等价性、比的反比例性等。通过具体例子，帮助学生理解这些性质。'
      },
      {
        title: '正比例',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数量关系')!,
        order_index: 3,
        content: '正比例是数量关系的重要形式，包括正比例的定义、正比例的性质等。通过具体例子，帮助学生理解正比例的概念。'
      },
      {
        title: '反比例',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数量关系')!,
        order_index: 4,
        content: '反比例是数量关系的重要形式，包括反比例的定义、反比例的性质等。通过具体例子，帮助学生理解反比例的概念。'
      },
      {
        title: '比例尺',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数量关系')!,
        order_index: 5,
        content: '比例尺是数量关系的重要工具，包括比例尺的定义、比例尺的应用等。通过具体例子，帮助学生理解比例尺的概念。'
      },

      // 基础数感的子知识点
      {
        title: '1-100认读数与书写',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('基础数感')!,
        order_index: 1,
        content: '1-100认读数与书写是数学学习的基本技能，包括1-100的认读和书写方法。通过练习，帮助学生掌握这些技能。'
      },
      {
        title: '人民币识别与简单计算',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('基础数感')!,
        order_index: 2,
        content: '人民币识别与简单计算是数学在生活中的重要应用，包括人民币的识别和简单计算。通过实践活动，培养学生的应用能力。'
      },
      {
        title: '整数的四则运算',
        level: 2,
        grade: 2,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('基础数感')!,
        order_index: 3,
        content: '整数的四则运算是数学学习的重要内容，包括加法、减法、乘法、除法的运算。通过具体例子，帮助学生掌握这些运算方法。'
      },
      {
        title: '数的分解与组合',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('基础数感')!,
        order_index: 4,
        content: '数的分解与组合是理解数的重要方法，包括数的分解和组合。通过实践活动，帮助学生理解这些方法。'
      },
      {
        title: '数的比较与排序',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('基础数感')!,
        order_index: 5,
        content: '数的比较与排序是数学思维的重要基础，包括数的比较和排序方法。通过实践活动，培养学生的比较能力。'
      },

      // 数值扩展的子知识点
      {
        title: '小数认识与大小比较',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数值扩展')!,
        order_index: 1,
        content: '小数认识与大小比较是理解数值扩展的重要内容，包括小数的概念、小数的读写方法、小数的大小比较等。通过具体例子，帮助学生理解这些概念。'
      },
      {
        title: '分数初步',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数值扩展')!,
        order_index: 2,
        content: '分数初步是理解数值扩展的重要内容，包括分数的概念、分数的读写方法、分数的大小比较等。通过具体例子，帮助学生理解这些概念。'
      },
      {
        title: '亿以内数的读写',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数值扩展')!,
        order_index: 3,
        content: '亿以内数的读写是理解数值扩展的重要内容，包括亿以内数的读法和写法。通过具体例子，帮助学生掌握这些技能。'
      },
      {
        title: '分数与小数互化',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数值扩展')!,
        order_index: 4,
        content: '分数与小数互化是理解数值扩展的重要方法，包括分数转化为小数、小数转化为分数等。通过具体例子，帮助学生掌握这些方法。'
      },
      {
        title: '数的近似值',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('数值扩展')!,
        order_index: 5,
        content: '数的近似值是理解数值扩展的重要概念，包括数的近似计算和应用。通过具体例子，帮助学生理解这些概念。'
      },

      // 抽象运算的子知识点
      {
        title: '分数运算',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('抽象运算')!,
        order_index: 1,
        content: '分数运算是理解抽象运算的重要内容，包括分数的加法、减法、乘法、除法等运算。通过具体例子，帮助学生掌握这些运算方法。'
      },
      {
        title: '小数四则混合运算',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('抽象运算')!,
        order_index: 2,
        content: '小数四则混合运算是理解抽象运算的重要内容，包括小数的加法、减法、乘法、除法等运算。通过具体例子，帮助学生掌握这些运算方法。'
      },
      {
        title: '负数认识与应用',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('抽象运算')!,
        order_index: 3,
        content: '负数认识与应用是理解抽象运算的重要内容，包括负数的概念、负数的读写方法、负数的应用等。通过具体例子，帮助学生理解这些概念。'
      },
      {
        title: '代数式化简',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('抽象运算')!,
        order_index: 4,
        content: '代数式化简是理解抽象运算的重要内容，包括代数式的化简方法和应用。通过具体例子，帮助学生掌握这些方法。'
      },
      {
        title: '运算律应用',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('抽象运算')!,
        order_index: 5,
        content: '运算律应用是理解抽象运算的重要内容，包括加法交换律、乘法交换律、结合律、分配律等运算律的应用。通过具体例子，帮助学生掌握这些应用方法。'
      },

      // 高阶代数的子知识点
      {
        title: '比例与比的应用',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('高阶代数')!,
        order_index: 1,
        content: '比例与比的应用是理解高阶代数的重要内容，包括比例的概念、比例的应用、比的概念、比的应用等。通过具体例子，帮助学生掌握这些应用方法。'
      },
      {
        title: '百分数运算',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('高阶代数')!,
        order_index: 2,
        content: '百分数运算是理解高阶代数的重要内容，包括百分数的概念、百分数的读写方法、百分数的应用等。通过具体例子，帮助学生掌握这些应用方法。'
      },
      {
        title: '简易方程',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('高阶代数')!,
        order_index: 3,
        content: '简易方程是理解高阶代数的重要内容，包括一元一次方程、一元二次方程等。通过具体例子，帮助学生掌握这些方程的解法。'
      },
      {
        title: '不等式初步',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('高阶代数')!,
        order_index: 4,
        content: '不等式初步是理解高阶代数的重要内容，包括一元一次不等式、一元二次不等式等。通过具体例子，帮助学生掌握这些不等式的解法。'
      },
      {
        title: '函数概念',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('数与代数')!,
        parent_id: parentPointMap.get('高阶代数')!,
        order_index: 5,
        content: '函数概念是理解高阶代数的重要内容，包括函数的定义、函数的表示方法、函数的应用等。通过具体例子，帮助学生理解这些概念。'
      },

      // 图形认知的子知识点
      {
        title: '平面图形特征',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形认知')!,
        order_index: 1,
        content: '平面图形特征是对平面图形的基本认识，包括边、角等特征。通过观察和操作，帮助学生认识各种平面图形。'
      },
      {
        title: '立体图形特征',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形认知')!,
        order_index: 2,
        content: '立体图形特征是对立体图形的基本认识，包括面、棱、顶点等特征。通过观察和操作，帮助学生认识各种立体图形。'
      },
      {
        title: '图形分类',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形认知')!,
        order_index: 3,
        content: '图形分类是对图形进行归类的重要方法。通过实践活动，培养学生的分类能力。'
      },
      {
        title: '图形组合',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形认知')!,
        order_index: 4,
        content: '图形组合是理解图形关系的重要方式。通过实践活动，帮助学生理解图形的组合。'
      },
      {
        title: '图形的边与角',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形认知')!,
        order_index: 5,
        content: '图形的边与角是图形的基本要素。通过实践活动，帮助学生认识图形的边和角。'
      },

      // 图形运动的子知识点
      {
        title: '轴对称',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形运动')!,
        order_index: 1,
        content: '轴对称是图形运动的重要形式，包括轴对称的定义、轴对称的性质等。通过具体例子，帮助学生理解轴对称的概念。'
      },
      {
        title: '平移',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形运动')!,
        order_index: 2,
        content: '平移是图形运动的重要形式，包括平移的定义、平移的性质等。通过具体例子，帮助学生理解平移的概念。'
      },
      {
        title: '旋转',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形运动')!,
        order_index: 3,
        content: '旋转是图形运动的重要形式，包括旋转的定义、旋转的性质等。通过具体例子，帮助学生理解旋转的概念。'
      },
      {
        title: '图形的位置',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形运动')!,
        order_index: 4,
        content: '图形的位置是理解图形运动的重要概念，包括图形的位置关系、坐标等。通过实践活动，帮助学生理解这些概念。'
      },
      {
        title: '方向与坐标',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('图形运动')!,
        order_index: 5,
        content: '方向与坐标是理解图形运动的重要概念，包括方向的表示方法、坐标系的建立等。通过实践活动，帮助学生理解这些概念。'
      },

      // 基础认知的子知识点
      {
        title: '基本图形识别',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('基础认知')!,
        order_index: 1,
        content: '基本图形识别是理解图形认知的重要内容，包括各种基本图形的识别方法。通过实践活动，帮助学生掌握这些识别方法。'
      },
      {
        title: '位置关系',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('基础认知')!,
        order_index: 2,
        content: '位置关系是理解图形认知的重要概念，包括点、线、面之间的关系。通过实践活动，帮助学生理解这些关系。'
      },
      {
        title: '图形分类',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('基础认知')!,
        order_index: 3,
        content: '图形分类是理解图形认知的重要方法，包括图形的分类标准和分类方法。通过实践活动，培养学生的分类能力。'
      },
      {
        title: '图形组合',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('基础认知')!,
        order_index: 4,
        content: '图形组合是理解图形认知的重要概念，包括图形的组合方式和组合规律。通过实践活动，帮助学生理解这些概念。'
      },
      {
        title: '图形变换',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('基础认知')!,
        order_index: 5,
        content: '图形变换是理解图形认知的重要概念，包括图形的平移、旋转、对称等变换。通过实践活动，帮助学生理解这些变换。'
      },

      // 测量技能的子知识点
      {
        title: '长度单位换算',
        level: 1,
        grade: 2,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('测量技能')!,
        order_index: 1,
        content: '长度单位换算是理解测量技能的重要内容，包括长度单位的换算方法和应用。通过具体例子，帮助学生掌握这些换算方法。'
      },
      {
        title: '角的认识',
        level: 1,
        grade: 2,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('测量技能')!,
        order_index: 2,
        content: '角的认识是理解测量技能的重要概念，包括角的定义、角的表示方法等。通过实践活动，帮助学生理解这些概念。'
      },
      {
        title: '面积计算',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('测量技能')!,
        order_index: 3,
        content: '面积计算是理解测量技能的重要内容，包括各种图形的面积计算方法和应用。通过具体例子，帮助学生掌握这些计算方法。'
      },
      {
        title: '体积计算',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('测量技能')!,
        order_index: 4,
        content: '体积计算是理解测量技能的重要内容，包括各种几何体的体积计算方法和应用。通过具体例子，帮助学生掌握这些计算方法。'
      },
      {
        title: '时间单位换算',
        level: 1,
        grade: 2,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('测量技能')!,
        order_index: 5,
        content: '时间单位换算是理解测量技能的重要内容，包括时间单位的换算方法和应用。通过具体例子，帮助学生掌握这些换算方法。'
      },

      // 空间思维的子知识点
      {
        title: '立体图形展开图',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('空间思维')!,
        order_index: 1,
        content: '立体图形展开图是理解空间思维的重要内容，包括各种立体图形的展开方法和应用。通过具体例子，帮助学生掌握这些展开方法。'
      },
      {
        title: '坐标定位',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('空间思维')!,
        order_index: 2,
        content: '坐标定位是理解空间思维的重要概念，包括坐标系的建立和坐标的使用方法。通过实践活动，帮助学生理解这些概念。'
      },
      {
        title: '圆的周长与面积',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('空间思维')!,
        order_index: 3,
        content: '圆的周长与面积是理解空间思维的重要内容，包括圆的周长计算方法和圆的面积计算方法。通过具体例子，帮助学生掌握这些计算方法。'
      },
      {
        title: '空间旋转',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('空间思维')!,
        order_index: 4,
        content: '空间旋转是理解空间思维的重要概念，包括空间旋转的定义和空间旋转的应用。通过具体例子，帮助学生理解这些概念。'
      },
      {
        title: '空间投影',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('空间思维')!,
        order_index: 5,
        content: '空间投影是理解空间思维的重要概念，包括空间投影的定义和空间投影的应用。通过具体例子，帮助学生理解这些概念。'
      },

      // 几何证明的子知识点
      {
        title: '三角形内角和',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('几何证明')!,
        order_index: 1,
        content: '三角形内角和是理解几何证明的重要内容，包括三角形内角和的定义和三角形内角和的性质。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '平行四边形面积推导',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('几何证明')!,
        order_index: 2,
        content: '平行四边形面积推导是理解几何证明的重要内容，包括平行四边形面积的计算方法和面积推导过程。通过具体例子，帮助学生掌握这些方法。'
      },
      {
        title: '圆柱/圆锥体积计算',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('几何证明')!,
        order_index: 3,
        content: '圆柱/圆锥体积计算是理解几何证明的重要内容，包括圆柱体积和圆锥体积的计算方法和应用。通过具体例子，帮助学生掌握这些计算方法。'
      },
      {
        title: '相似三角形',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('几何证明')!,
        order_index: 4,
        content: '相似三角形是理解几何证明的重要概念，包括相似三角形的定义和相似三角形的性质。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '勾股定理',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('空间与几何')!,
        parent_id: parentPointMap.get('几何证明')!,
        order_index: 5,
        content: '勾股定理是理解几何证明的重要内容，包括勾股定理的定义和勾股定理的应用。通过具体例子，帮助学生掌握这些概念。'
      },

      // 统计图表的子知识点
      {
        title: '条形统计图',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('统计图表')!,
        order_index: 1,
        content: '条形统计图是最常用的统计图表之一，用于表示不同类别的数量比较。通过实践活动，帮助学生理解和使用条形图。'
      },
      {
        title: '折线统计图',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('统计图表')!,
        order_index: 2,
        content: '折线统计图用于表示数据随时间的变化趋势。通过实践活动，帮助学生理解和使用折线图。'
      },
      {
        title: '扇形统计图',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('统计图表')!,
        order_index: 3,
        content: '扇形统计图用于表示整体中各部分所占的比例。通过实践活动，帮助学生理解和使用扇形图。'
      },
      {
        title: '复式统计图',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('统计图表')!,
        order_index: 4,
        content: '复式统计图用于比较不同类别的数据。通过实践活动，帮助学生理解和使用复式统计图。'
      },
      {
        title: '统计图的选择',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('统计图表')!,
        order_index: 5,
        content: '统计图的选择是根据数据特点选择合适的图表类型。通过实践活动，培养学生的选择能力。'
      },

      // 随机抽样的子知识点
      {
        title: '简单随机抽样',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('随机抽样')!,
        order_index: 1,
        content: '简单随机抽样是统计调查的重要方法，包括简单随机抽样、系统抽样、分层抽样等。通过实践活动，帮助学生理解这些方法。'
      },
      {
        title: '系统抽样',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('随机抽样')!,
        order_index: 2,
        content: '系统抽样是统计调查的重要方法，包括系统抽样、系统抽样的应用等。通过具体例子，帮助学生理解这些方法。'
      },
      {
        title: '分层抽样',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('随机抽样')!,
        order_index: 3,
        content: '分层抽样是统计调查的重要方法，包括分层抽样、分层抽样的应用等。通过具体例子，帮助学生理解这些方法。'
      },
      {
        title: '样本代表性',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('随机抽样')!,
        order_index: 4,
        content: '样本代表性是理解随机抽样的重要概念，包括样本的代表性和样本的代表性应用等。通过具体例子，帮助学生理解这些概念。'
      },
      {
        title: '抽样误差',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('随机抽样')!,
        order_index: 5,
        content: '抽样误差是理解随机抽样的重要概念，包括抽样误差的定义和抽样误差的应用等。通过具体例子，帮助学生理解这些概念。'
      },

      // 数据收集的子知识点
      {
        title: '简单分类统计',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据收集')!,
        order_index: 1,
        content: '简单分类统计是理解数据收集的重要内容，包括简单分类统计、简单分类统计的应用等。通过具体例子，帮助学生掌握这些方法。'
      },
      {
        title: '条形统计图',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据收集')!,
        order_index: 2,
        content: '条形统计图是最常用的统计图表之一，用于表示不同类别的数量比较。通过实践活动，帮助学生理解和使用条形图。'
      },
      {
        title: '数据整理',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据收集')!,
        order_index: 3,
        content: '数据整理是理解数据收集的重要内容，包括数据整理、数据整理的应用等。通过具体例子，帮助学生掌握这些方法。'
      },
      {
        title: '数据记录',
        level: 1,
        grade: 1,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据收集')!,
        order_index: 4,
        content: '数据记录是理解数据收集的重要内容，包括数据记录、数据记录的应用等。通过具体例子，帮助学生掌握这些方法。'
      },
      {
        title: '数据展示',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据收集')!,
        order_index: 5,
        content: '数据展示是理解数据收集的重要内容，包括数据展示、数据展示的应用等。通过具体例子，帮助学生掌握这些方法。'
      },

      // 概率基础的子知识点
      {
        title: '可能性判断',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('概率基础')!,
        order_index: 1,
        content: '可能性判断是理解概率基础的重要内容，包括可能性、可能性判断的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '概率计算',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('概率基础')!,
        order_index: 2,
        content: '概率计算是理解概率基础的重要内容，包括概率计算、概率计算的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '事件分类',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('概率基础')!,
        order_index: 3,
        content: '事件分类是理解概率基础的重要内容，包括事件分类、事件分类的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '概率模型',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('概率基础')!,
        order_index: 4,
        content: '概率模型是理解概率基础的重要内容，包括概率模型、概率模型的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '概率应用',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('概率基础')!,
        order_index: 5,
        content: '概率应用是理解概率基础的重要内容，包括概率应用、概率应用的应用等。通过具体例子，帮助学生掌握这些概念。'
      },

      // 数据分析的子知识点
      {
        title: '折线统计图',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据分析')!,
        order_index: 1,
        content: '折线统计图用于表示数据随时间的变化趋势。通过实践活动，帮助学生理解和使用折线图。'
      },
      {
        title: '平均数计算',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据分析')!,
        order_index: 2,
        content: '平均数计算是理解数据分析的重要内容，包括平均数的定义和平均数的计算方法。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '扇形统计图',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据分析')!,
        order_index: 3,
        content: '扇形统计图用于表示数据的比例关系。通过实践活动，帮助学生理解和使用扇形图。'
      },
      {
        title: '数据趋势分析',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据分析')!,
        order_index: 4,
        content: '数据趋势分析是理解数据分析的重要内容，包括数据的趋势分析和趋势分析的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '数据预测',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('统计与概率')!,
        parent_id: parentPointMap.get('数据分析')!,
        order_index: 5,
        content: '数据预测是理解数据分析的重要内容，包括数据预测、数据预测的应用等。通过具体例子，帮助学生掌握这些概念。'
      },

      // 生活应用的子知识点
      {
        title: '购物计算',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('生活应用')!,
        order_index: 1,
        content: '购物计算是数学在生活中的重要应用，包括价格计算、找零等。通过实践活动，培养学生的计算能力。'
      },
      {
        title: '时间计算',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('生活应用')!,
        order_index: 2,
        content: '时间计算是数学在生活中的重要应用，包括时间加减、时间间隔等。通过实践活动，培养学生的计算能力。'
      },
      {
        title: '行程问题',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('生活应用')!,
        order_index: 3,
        content: '行程问题是数学在生活中的重要应用，包括速度、时间、距离的计算。通过实践活动，培养学生的应用能力。'
      },
      {
        title: '配方问题',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('生活应用')!,
        order_index: 4,
        content: '配方问题是数学在生活中的重要应用，包括比例计算等。通过实践活动，培养学生的应用能力。'
      },
      {
        title: '简单预算',
        level: 2,
        grade: 3,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('生活应用')!,
        order_index: 5,
        content: '简单预算是数学在生活中的重要应用，包括收支计算等。通过实践活动，培养学生的应用能力。'
      },

      // 跨学科应用的子知识点
      {
        title: '科学计算',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('跨学科应用')!,
        order_index: 1,
        content: '科学计算是数学在科学中的重要应用，包括科学计算、科学计算的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '体育数据',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('跨学科应用')!,
        order_index: 2,
        content: '体育数据是数学在体育中的重要应用，包括体育数据、体育数据的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '音乐节奏',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('跨学科应用')!,
        order_index: 3,
        content: '音乐节奏是数学在音乐中的重要应用，包括音乐节奏、音乐节奏的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '美术比例',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('跨学科应用')!,
        order_index: 4,
        content: '美术比例是数学在美术中的重要应用，包括美术比例、美术比例的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '地理测量',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('跨学科应用')!,
        order_index: 5,
        content: '地理测量是数学在地理中的重要应用，包括地理测量、地理测量的应用等。通过具体例子，帮助学生掌握这些概念。'
      },

      // 实际问题的子知识点
      {
        title: '植树问题',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('实际问题')!,
        order_index: 1,
        content: '植树问题是数学在生活中的重要应用，包括植树问题、植树问题的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '鸡兔同笼',
        level: 3,
        grade: 5,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('实际问题')!,
        order_index: 2,
        content: '鸡兔同笼是数学在生活中的重要应用，包括鸡兔同笼问题、鸡兔同笼问题的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '行程问题',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('实际问题')!,
        order_index: 3,
        content: '行程问题是数学在生活中的重要应用，包括行程问题、行程问题的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '工程问题',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('实际问题')!,
        order_index: 4,
        content: '工程问题是数学在生活中的重要应用，包括工程问题、工程问题的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '盈亏问题',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('实际问题')!,
        order_index: 5,
        content: '盈亏问题是数学在生活中的重要应用，包括盈亏问题、盈亏问题的应用等。通过具体例子，帮助学生掌握这些概念。'
      },

      // 数学建模的子知识点
      {
        title: '优化问题',
        level: 2,
        grade: 4,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('数学建模')!,
        order_index: 1,
        content: '优化问题是数学在生活中的重要应用，包括优化问题、优化问题的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '经济模型',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('数学建模')!,
        order_index: 2,
        content: '经济模型是数学在经济学中的重要应用，包括经济模型、经济模型的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '工程问题',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('数学建模')!,
        order_index: 3,
        content: '工程问题是数学在工程学中的重要应用，包括工程问题、工程问题的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '统计模型',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('数学建模')!,
        order_index: 4,
        content: '统计模型是数学在统计学中的重要应用，包括统计模型、统计模型的应用等。通过具体例子，帮助学生掌握这些概念。'
      },
      {
        title: '预测模型',
        level: 3,
        grade: 6,
        category_id: categoryMap.get('综合应用')!,
        parent_id: parentPointMap.get('数学建模')!,
        order_index: 5,
        content: '预测模型是数学在预测中的重要应用，包括预测模型、预测模型的应用等。通过具体例子，帮助学生掌握这些概念。'
      }
    ]

    // 插入子知识点
    for (const point of childPoints) {
      await prisma.knowledgePoint.create({
        data: {
          title: point.title,
          level: point.level,
          grade: point.grade,
          category_id: point.category_id,
          parent_id: point.parent_id,
          order_index: point.order_index,
          content: point.content
        }
      })
    }

    res.status(200).json({ 
      success: true,
      message: '知识点初始化成功',
      data: { parentPoints, childPoints }
    })
  } catch (error) {
    console.error('初始化知识点失败:', error)
    res.status(500).json({ 
      success: false,
      message: '初始化知识点失败',
      error: error instanceof Error ? error.message : String(error)
    })
  } finally {
    await prisma.$disconnect()
  }
} 