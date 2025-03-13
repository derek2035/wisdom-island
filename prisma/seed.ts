import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 清理现有数据
  await prisma.userKnowledgeProgress.deleteMany()
  await prisma.knowledgePoint.deleteMany()
  await prisma.knowledgeCategory.deleteMany()

  // 创建四大领域分类
  const category1 = await prisma.knowledgeCategory.create({
    data: {
      name: '数与代数'
    }
  })

  const category2 = await prisma.knowledgeCategory.create({
    data: {
      name: '图形与几何'
    }
  })

  const category3 = await prisma.knowledgeCategory.create({
    data: {
      name: '统计与概率'
    }
  })

  const category4 = await prisma.knowledgeCategory.create({
    data: {
      name: '综合与实践'
    }
  })

  // 数与代数二级知识点（5个方向）
  const naturalNumber = await prisma.knowledgePoint.create({
    data: {
      title: '自然数',
      level: 1,
      grade: 0,
      content: '自然数的认识与运算',
      order_index: 1,
      category_id: category1.id
    }
  })

  const integer = await prisma.knowledgePoint.create({
    data: {
      title: '整数',
      level: 1,
      grade: 0,
      content: '整数的认识与运算',
      order_index: 2,
      category_id: category1.id
    }
  })

  const fraction = await prisma.knowledgePoint.create({
    data: {
      title: '分数',
      level: 1,
      grade: 0,
      content: '分数的认识与运算',
      order_index: 3,
      category_id: category1.id
    }
  })

  const decimal = await prisma.knowledgePoint.create({
    data: {
      title: '小数',
      level: 1,
      grade: 0,
      content: '小数的认识与运算',
      order_index: 4,
      category_id: category1.id
    }
  })

  const algebra = await prisma.knowledgePoint.create({
    data: {
      title: '代数初步',
      level: 1,
      grade: 0,
      content: '运算定律与简单方程',
      order_index: 5,
      category_id: category1.id
    }
  })

  // 图形与几何二级知识点（5个方向）
  const basicShape = await prisma.knowledgePoint.create({
    data: {
      title: '基本图形',
      level: 1,
      grade: 0,
      content: '基本图形的认识',
      order_index: 1,
      category_id: category2.id
    }
  })

  const plane = await prisma.knowledgePoint.create({
    data: {
      title: '平面图形',
      level: 1,
      grade: 0,
      content: '平面图形的性质与计算',
      order_index: 2,
      category_id: category2.id
    }
  })

  const solid = await prisma.knowledgePoint.create({
    data: {
      title: '立体图形',
      level: 1,
      grade: 0,
      content: '立体图形的认识与计算',
      order_index: 3,
      category_id: category2.id
    }
  })

  const position = await prisma.knowledgePoint.create({
    data: {
      title: '位置与方向',
      level: 1,
      grade: 0,
      content: '空间与平面位置关系',
      order_index: 4,
      category_id: category2.id
    }
  })

  const measurement = await prisma.knowledgePoint.create({
    data: {
      title: '图形测量',
      level: 1,
      grade: 0,
      content: '图形的测量与计算',
      order_index: 5,
      category_id: category2.id
    }
  })

  // 统计与概率二级知识点（4个方向）
  const dataCollection = await prisma.knowledgePoint.create({
    data: {
      title: '数据收集',
      level: 1,
      grade: 0,
      content: '数据的收集方法与应用',
      order_index: 1,
      category_id: category3.id
    }
  })

  const dataOrganization = await prisma.knowledgePoint.create({
    data: {
      title: '数据整理',
      level: 1,
      grade: 0,
      content: '数据的分类与表示',
      order_index: 2,
      category_id: category3.id
    }
  })

  const dataAnalysis = await prisma.knowledgePoint.create({
    data: {
      title: '数据分析',
      level: 1,
      grade: 0,
      content: '数据的分析与应用',
      order_index: 3,
      category_id: category3.id
    }
  })

  const probability = await prisma.knowledgePoint.create({
    data: {
      title: '概率初步',
      level: 1,
      grade: 0,
      content: '随机事件与概率',
      order_index: 4,
      category_id: category3.id
    }
  })

  // 综合与实践二级知识点（4个方向）
  const lifeApplication = await prisma.knowledgePoint.create({
    data: {
      title: '生活应用',
      level: 1,
      grade: 0,
      content: '数学在生活中的应用',
      order_index: 1,
      category_id: category4.id
    }
  })

  const problemSolving = await prisma.knowledgePoint.create({
    data: {
      title: '实践探索',
      level: 1,
      grade: 0,
      content: '数学探索与实践活动',
      order_index: 2,
      category_id: category4.id
    }
  })

  const modeling = await prisma.knowledgePoint.create({
    data: {
      title: '数学建模',
      level: 1,
      grade: 0,
      content: '简单的数学建模',
      order_index: 3,
      category_id: category4.id
    }
  })

  const thinking = await prisma.knowledgePoint.create({
    data: {
      title: '数学思维',
      level: 1,
      grade: 0,
      content: '数学思维方法训练',
      order_index: 4,
      category_id: category4.id
    }
  })

  // 创建三级知识点
  await prisma.knowledgePoint.createMany({
    data: [
      // 自然数的三级知识点
      {
        title: '20以内数的认识',
        level: 2,
        grade: 1,
        content: '20以内数的认识和数数',
        order_index: 1,
        category_id: category1.id,
        parent_id: naturalNumber.id
      },
      {
        title: '100以内数的认识',
        level: 2,
        grade: 2,
        content: '100以内数的组成与比较',
        order_index: 2,
        category_id: category1.id,
        parent_id: naturalNumber.id
      },
      {
        title: '1000以内数的认识',
        level: 2,
        grade: 2,
        content: '1000以内数的读写与比较',
        order_index: 3,
        category_id: category1.id,
        parent_id: naturalNumber.id
      },
      {
        title: '万以内数的认识',
        level: 2,
        grade: 3,
        content: '万以内数的读写与比较',
        order_index: 4,
        category_id: category1.id,
        parent_id: naturalNumber.id
      },

      // 整数的三级知识点
      {
        title: '20以内的加减法',
        level: 2,
        grade: 1,
        content: '20以内数的加法和减法',
        order_index: 1,
        category_id: category1.id,
        parent_id: integer.id
      },
      {
        title: '100以内的加减法',
        level: 2,
        grade: 2,
        content: '100以内的加减法计算',
        order_index: 2,
        category_id: category1.id,
        parent_id: integer.id
      },
      {
        title: '表内乘法',
        level: 2,
        grade: 2,
        content: '乘法表的记忆和应用',
        order_index: 3,
        category_id: category1.id,
        parent_id: integer.id
      },
      {
        title: '整数除法',
        level: 2,
        grade: 3,
        content: '整数除法的计算',
        order_index: 4,
        category_id: category1.id,
        parent_id: integer.id
      },

      // 分数的三级知识点
      {
        title: '分数的认识',
        level: 2,
        grade: 3,
        content: '分数的基本概念',
        order_index: 1,
        category_id: category1.id,
        parent_id: fraction.id
      },
      {
        title: '真分数与假分数',
        level: 2,
        grade: 4,
        content: '真分数、假分数和带分数',
        order_index: 2,
        category_id: category1.id,
        parent_id: fraction.id
      },
      {
        title: '分数的基本性质',
        level: 2,
        grade: 5,
        content: '分数的约分与通分',
        order_index: 3,
        category_id: category1.id,
        parent_id: fraction.id
      },
      {
        title: '分数四则运算',
        level: 2,
        grade: 6,
        content: '分数的加减乘除',
        order_index: 4,
        category_id: category1.id,
        parent_id: fraction.id
      },

      // 小数的三级知识点
      {
        title: '小数的认识',
        level: 2,
        grade: 4,
        content: '小数的意义和记法',
        order_index: 1,
        category_id: category1.id,
        parent_id: decimal.id
      },
      {
        title: '小数的读写',
        level: 2,
        grade: 4,
        content: '小数的读法和写法',
        order_index: 2,
        category_id: category1.id,
        parent_id: decimal.id
      },
      {
        title: '小数的加减',
        level: 2,
        grade: 5,
        content: '小数的加法和减法',
        order_index: 3,
        category_id: category1.id,
        parent_id: decimal.id
      },
      {
        title: '小数的乘除',
        level: 2,
        grade: 5,
        content: '小数的乘法和除法',
        order_index: 4,
        category_id: category1.id,
        parent_id: decimal.id
      },

      // 代数初步的三级知识点
      {
        title: '运算定律',
        level: 2,
        grade: 3,
        content: '加法和乘法运算定律',
        order_index: 1,
        category_id: category1.id,
        parent_id: algebra.id
      },
      {
        title: '简单方程',
        level: 2,
        grade: 6,
        content: '简单方程的解法',
        order_index: 2,
        category_id: category1.id,
        parent_id: algebra.id
      },
      {
        title: '比和比例',
        level: 2,
        grade: 6,
        content: '比和比例的应用',
        order_index: 3,
        category_id: category1.id,
        parent_id: algebra.id
      },

      // 基本图形的三级知识点
      {
        title: '基本平面图形',
        level: 2,
        grade: 1,
        content: '点、线、面的认识',
        order_index: 1,
        category_id: category2.id,
        parent_id: basicShape.id
      },
      {
        title: '线段与直线',
        level: 2,
        grade: 2,
        content: '线段、直线的认识和度量',
        order_index: 2,
        category_id: category2.id,
        parent_id: basicShape.id
      },
      {
        title: '角的认识',
        level: 2,
        grade: 3,
        content: '角的概念和度量',
        order_index: 3,
        category_id: category2.id,
        parent_id: basicShape.id
      },
      {
        title: '平行与垂直',
        level: 2,
        grade: 4,
        content: '平行线和垂直线',
        order_index: 4,
        category_id: category2.id,
        parent_id: basicShape.id
      },

      // 平面图形的三级知识点
      {
        title: '三角形',
        level: 2,
        grade: 2,
        content: '三角形的认识和分类',
        order_index: 1,
        category_id: category2.id,
        parent_id: plane.id
      },
      {
        title: '四边形',
        level: 2,
        grade: 3,
        content: '四边形的认识和分类',
        order_index: 2,
        category_id: category2.id,
        parent_id: plane.id
      },
      {
        title: '正方形和长方形',
        level: 2,
        grade: 4,
        content: '正方形和长方形的性质',
        order_index: 3,
        category_id: category2.id,
        parent_id: plane.id
      },
      {
        title: '平行四边形',
        level: 2,
        grade: 5,
        content: '平行四边形的性质',
        order_index: 4,
        category_id: category2.id,
        parent_id: plane.id
      },
      {
        title: '圆',
        level: 2,
        grade: 6,
        content: '圆的认识和性质',
        order_index: 5,
        category_id: category2.id,
        parent_id: plane.id
      },

      // 立体图形的三级知识点
      {
        title: '立体图形认识',
        level: 2,
        grade: 1,
        content: '常见立体图形的认识',
        order_index: 1,
        category_id: category2.id,
        parent_id: solid.id
      },
      {
        title: '长方体和正方体',
        level: 2,
        grade: 5,
        content: '长方体和正方体的认识',
        order_index: 2,
        category_id: category2.id,
        parent_id: solid.id
      },
      {
        title: '圆柱和圆锥',
        level: 2,
        grade: 6,
        content: '圆柱和圆锥的认识',
        order_index: 3,
        category_id: category2.id,
        parent_id: solid.id
      },

      // 位置与方向的三级知识点
      {
        title: '空间方位',
        level: 2,
        grade: 1,
        content: '上下左右前后的位置',
        order_index: 1,
        category_id: category2.id,
        parent_id: position.id
      },
      {
        title: '平面位置',
        level: 2,
        grade: 2,
        content: '平面上的位置关系',
        order_index: 2,
        category_id: category2.id,
        parent_id: position.id
      },
      {
        title: '方向与路线',
        level: 2,
        grade: 3,
        content: '方向识别和路线设计',
        order_index: 3,
        category_id: category2.id,
        parent_id: position.id
      },

      // 图形测量的三级知识点
      {
        title: '长度测量',
        level: 2,
        grade: 2,
        content: '长度单位及测量',
        order_index: 1,
        category_id: category2.id,
        parent_id: measurement.id
      },
      {
        title: '周长',
        level: 2,
        grade: 3,
        content: '周长的计算',
        order_index: 2,
        category_id: category2.id,
        parent_id: measurement.id
      },
      {
        title: '面积',
        level: 2,
        grade: 4,
        content: '面积的计算',
        order_index: 3,
        category_id: category2.id,
        parent_id: measurement.id
      },
      {
        title: '体积',
        level: 2,
        grade: 5,
        content: '体积的计算',
        order_index: 4,
        category_id: category2.id,
        parent_id: measurement.id
      },

      // 数据收集的三级知识点
      {
        title: '调查内容的设计',
        level: 2,
        grade: 3,
        content: '调查内容和方法的设计',
        order_index: 1,
        category_id: category3.id,
        parent_id: dataCollection.id
      },
      {
        title: '数据采集方法',
        level: 2,
        grade: 4,
        content: '数据收集的基本方法',
        order_index: 2,
        category_id: category3.id,
        parent_id: dataCollection.id
      },
      {
        title: '数据收集工具',
        level: 2,
        grade: 5,
        content: '数据收集工具的使用',
        order_index: 3,
        category_id: category3.id,
        parent_id: dataCollection.id
      },

      // 数据整理的三级知识点
      {
        title: '数据分类',
        level: 2,
        grade: 3,
        content: '数据的分类方法',
        order_index: 1,
        category_id: category3.id,
        parent_id: dataOrganization.id
      },
      {
        title: '统计表',
        level: 2,
        grade: 4,
        content: '统计表的制作',
        order_index: 2,
        category_id: category3.id,
        parent_id: dataOrganization.id
      },
      {
        title: '统计图',
        level: 2,
        grade: 5,
        content: '统计图的绘制',
        order_index: 3,
        category_id: category3.id,
        parent_id: dataOrganization.id
      },

      // 数据分析的三级知识点
      {
        title: '数据特征',
        level: 2,
        grade: 4,
        content: '数据的基本特征',
        order_index: 1,
        category_id: category3.id,
        parent_id: dataAnalysis.id
      },
      {
        title: '数据分析方法',
        level: 2,
        grade: 5,
        content: '数据分析的基本方法',
        order_index: 2,
        category_id: category3.id,
        parent_id: dataAnalysis.id
      },
      {
        title: '数据分析应用',
        level: 2,
        grade: 6,
        content: '数据分析在实际中的应用',
        order_index: 3,
        category_id: category3.id,
        parent_id: dataAnalysis.id
      },

      // 概率初步的三级知识点
      {
        title: '可能性认识',
        level: 2,
        grade: 4,
        content: '事件发生的可能性',
        order_index: 1,
        category_id: category3.id,
        parent_id: probability.id
      },
      {
        title: '可能性大小比较',
        level: 2,
        grade: 5,
        content: '可能性大小的比较',
        order_index: 2,
        category_id: category3.id,
        parent_id: probability.id
      },
      {
        title: '简单概率计算',
        level: 2,
        grade: 6,
        content: '简单事件的概率计算',
        order_index: 3,
        category_id: category3.id,
        parent_id: probability.id
      },

      // 生活应用的三级知识点
      {
        title: '认识钟表',
        level: 2,
        grade: 1,
        content: '时间的认识和计算',
        order_index: 1,
        category_id: category4.id,
        parent_id: lifeApplication.id
      },
      {
        title: '认识人民币',
        level: 2,
        grade: 2,
        content: '人民币的认识和计算',
        order_index: 2,
        category_id: category4.id,
        parent_id: lifeApplication.id
      },
      {
        title: '简单购物',
        level: 2,
        grade: 3,
        content: '购物中的应用题',
        order_index: 3,
        category_id: category4.id,
        parent_id: lifeApplication.id
      },
      {
        title: '实际应用',
        level: 2,
        grade: 4,
        content: '数学在生活中的综合应用',
        order_index: 4,
        category_id: category4.id,
        parent_id: lifeApplication.id
      },

      // 实践探索的三级知识点
      {
        title: '数学游戏',
        level: 2,
        grade: 1,
        content: '趣味数学游戏',
        order_index: 1,
        category_id: category4.id,
        parent_id: problemSolving.id
      },
      {
        title: '测量活动',
        level: 2,
        grade: 2,
        content: '简单的测量实践',
        order_index: 2,
        category_id: category4.id,
        parent_id: problemSolving.id
      },
      {
        title: '动手操作',
        level: 2,
        grade: 3,
        content: '数学实践活动',
        order_index: 3,
        category_id: category4.id,
        parent_id: problemSolving.id
      },
      {
        title: '实地考察',
        level: 2,
        grade: 4,
        content: '数学实地考察活动',
        order_index: 4,
        category_id: category4.id,
        parent_id: problemSolving.id
      },

      // 数学建模的三级知识点
      {
        title: '数学抽象',
        level: 2,
        grade: 4,
        content: '从实际问题中抽象数学模型',
        order_index: 1,
        category_id: category4.id,
        parent_id: modeling.id
      },
      {
        title: '模型建立',
        level: 2,
        grade: 5,
        content: '简单数学模型的建立',
        order_index: 2,
        category_id: category4.id,
        parent_id: modeling.id
      },
      {
        title: '模型应用',
        level: 2,
        grade: 6,
        content: '数学模型的实际应用',
        order_index: 3,
        category_id: category4.id,
        parent_id: modeling.id
      },

      // 数学思维的三级知识点
      {
        title: '观察比较',
        level: 2,
        grade: 1,
        content: '观察和比较的方法',
        order_index: 1,
        category_id: category4.id,
        parent_id: thinking.id
      },
      {
        title: '分类归纳',
        level: 2,
        grade: 2,
        content: '分类和归纳的方法',
        order_index: 2,
        category_id: category4.id,
        parent_id: thinking.id
      },
      {
        title: '推理论证',
        level: 2,
        grade: 5,
        content: '简单的推理和论证',
        order_index: 3,
        category_id: category4.id,
        parent_id: thinking.id
      },
      {
        title: '综合应用',
        level: 2,
        grade: 6,
        content: '数学思维方法的综合运用',
        order_index: 4,
        category_id: category4.id,
        parent_id: thinking.id
      },

      // 代数初步补充知识点
      {
        title: '数量关系',
        level: 2,
        grade: 5,
        content: '数量关系的认识和应用',
        order_index: 4,
        category_id: category1.id,
        parent_id: algebra.id
      },

      // 立体图形补充知识点
      {
        title: '简单几何体的展开图',
        level: 2,
        grade: 5,
        content: '长方体和正方体的展开图',
        order_index: 4,
        category_id: category2.id,
        parent_id: solid.id
      },

      // 位置与方向补充知识点
      {
        title: '路线图与位置表示',
        level: 2,
        grade: 4,
        content: '路线图的绘制与位置的表示方法',
        order_index: 4,
        category_id: category2.id,
        parent_id: position.id
      },

      // 数据收集补充知识点
      {
        title: '生活中的数据收集',
        level: 2,
        grade: 3,
        content: '从生活实际中收集数据的方法',
        order_index: 4,
        category_id: category3.id,
        parent_id: dataCollection.id
      },

      // 数据整理补充知识点
      {
        title: '复式统计表',
        level: 2,
        grade: 5,
        content: '复式统计表的制作和使用',
        order_index: 4,
        category_id: category3.id,
        parent_id: dataOrganization.id
      },

      // 数据分析补充知识点
      {
        title: '数据分析报告',
        level: 2,
        grade: 6,
        content: '简单的数据分析报告的撰写',
        order_index: 4,
        category_id: category3.id,
        parent_id: dataAnalysis.id
      },

      // 概率初步补充知识点
      {
        title: '生活中的概率应用',
        level: 2,
        grade: 6,
        content: '概率在生活中的简单应用',
        order_index: 4,
        category_id: category3.id,
        parent_id: probability.id
      },

      // 数学建模补充知识点
      {
        title: '数学建模实践',
        level: 2,
        grade: 6,
        content: '简单的数学建模实践活动',
        order_index: 4,
        category_id: category4.id,
        parent_id: modeling.id
      },

      // 整数的补充知识点
      {
        title: '万以内的加减法',
        level: 2,
        grade: 3,
        content: '万以内数的加减法计算',
        order_index: 5,
        category_id: category1.id,
        parent_id: integer.id
      },
      {
        title: '多位数乘一位数',
        level: 2,
        grade: 3,
        content: '多位数乘一位数的计算方法',
        order_index: 6,
        category_id: category1.id,
        parent_id: integer.id
      },

      // 分数的补充知识点
      {
        title: '同分母分数加减',
        level: 2,
        grade: 4,
        content: '同分母分数的加减法',
        order_index: 5,
        category_id: category1.id,
        parent_id: fraction.id
      },
      {
        title: '异分母分数加减',
        level: 2,
        grade: 5,
        content: '异分母分数的加减法',
        order_index: 6,
        category_id: category1.id,
        parent_id: fraction.id
      },

      // 平面图形的补充知识点
      {
        title: '图形的轴对称',
        level: 2,
        grade: 4,
        content: '轴对称图形的特征和性质',
        order_index: 6,
        category_id: category2.id,
        parent_id: plane.id
      },
      {
        title: '图形的平移',
        level: 2,
        grade: 5,
        content: '图形平移的概念和应用',
        order_index: 7,
        category_id: category2.id,
        parent_id: plane.id
      },

      // 图形测量的补充知识点
      {
        title: '时间的测量',
        level: 2,
        grade: 2,
        content: '时间单位及计算',
        order_index: 5,
        category_id: category2.id,
        parent_id: measurement.id
      },
      {
        title: '质量的测量',
        level: 2,
        grade: 3,
        content: '质量单位及计算',
        order_index: 6,
        category_id: category2.id,
        parent_id: measurement.id
      },

      // 统计图的补充知识点
      {
        title: '条形统计图',
        level: 2,
        grade: 4,
        content: '条形统计图的绘制和读取',
        order_index: 4,
        category_id: category3.id,
        parent_id: dataOrganization.id
      },
      {
        title: '折线统计图',
        level: 2,
        grade: 5,
        content: '折线统计图的绘制和分析',
        order_index: 5,
        category_id: category3.id,
        parent_id: dataOrganization.id
      },

      // 生活应用的补充知识点
      {
        title: '长度和距离',
        level: 2,
        grade: 2,
        content: '日常生活中的长度和距离应用',
        order_index: 5,
        category_id: category4.id,
        parent_id: lifeApplication.id
      },
      {
        title: '行程问题',
        level: 2,
        grade: 5,
        content: '简单的行程应用题',
        order_index: 6,
        category_id: category4.id,
        parent_id: lifeApplication.id
      },

      // 实践探索的补充知识点
      {
        title: '估测活动',
        level: 2,
        grade: 3,
        content: '量的大小估测活动',
        order_index: 5,
        category_id: category4.id,
        parent_id: problemSolving.id
      },
      {
        title: '设计活动',
        level: 2,
        grade: 4,
        content: '简单的数学设计活动',
        order_index: 6,
        category_id: category4.id,
        parent_id: problemSolving.id
      },

      // 整数补充知识点
      {
        title: '多位数乘多位数',
        level: 2,
        grade: 4,
        content: '多位数乘法的计算方法',
        order_index: 7,
        category_id: category1.id,
        parent_id: integer.id
      },
      {
        title: '多位数除法',
        level: 2,
        grade: 4,
        content: '多位数除法的计算方法',
        order_index: 8,
        category_id: category1.id,
        parent_id: integer.id
      },

      // 分数补充知识点
      {
        title: '分数乘法',
        level: 2,
        grade: 5,
        content: '分数乘法的计算方法',
        order_index: 7,
        category_id: category1.id,
        parent_id: fraction.id
      },
      {
        title: '分数除法',
        level: 2,
        grade: 6,
        content: '分数除法的计算方法',
        order_index: 8,
        category_id: category1.id,
        parent_id: fraction.id
      },

      // 小数补充知识点
      {
        title: '小数的近似数',
        level: 2,
        grade: 5,
        content: '小数的四舍五入和近似值',
        order_index: 5,
        category_id: category1.id,
        parent_id: decimal.id
      },
      {
        title: '小数四则混合运算',
        level: 2,
        grade: 6,
        content: '小数的四则混合运算及应用',
        order_index: 6,
        category_id: category1.id,
        parent_id: decimal.id
      },

      // 代数初步补充知识点
      {
        title: '百分数',
        level: 2,
        grade: 5,
        content: '百分数的认识和应用',
        order_index: 5,
        category_id: category1.id,
        parent_id: algebra.id
      },
      {
        title: '方程应用',
        level: 2,
        grade: 6,
        content: '方程在实际问题中的应用',
        order_index: 6,
        category_id: category1.id,
        parent_id: algebra.id
      },

      // 基本图形补充知识点
      {
        title: '曲线和直线',
        level: 2,
        grade: 3,
        content: '曲线和直线的认识与区分',
        order_index: 5,
        category_id: category2.id,
        parent_id: basicShape.id
      },

      // 平面图形补充知识点
      {
        title: '梯形',
        level: 2,
        grade: 5,
        content: '梯形的性质和面积计算',
        order_index: 8,
        category_id: category2.id,
        parent_id: plane.id
      },
      {
        title: '扇形',
        level: 2,
        grade: 6,
        content: '扇形的认识和面积计算',
        order_index: 9,
        category_id: category2.id,
        parent_id: plane.id
      },

      // 立体图形补充知识点
      {
        title: '棱锥和球体',
        level: 2,
        grade: 6,
        content: '棱锥和球体的认识',
        order_index: 5,
        category_id: category2.id,
        parent_id: solid.id
      },

      // 位置与方向补充知识点
      {
        title: '坐标方格',
        level: 2,
        grade: 4,
        content: '平面直角坐标系的初步认识',
        order_index: 5,
        category_id: category2.id,
        parent_id: position.id
      },

      // 图形测量补充知识点
      {
        title: '容积',
        level: 2,
        grade: 5,
        content: '容积的概念和计算',
        order_index: 7,
        category_id: category2.id,
        parent_id: measurement.id
      },
      {
        title: '面积单位换算',
        level: 2,
        grade: 4,
        content: '面积单位间的换算',
        order_index: 8,
        category_id: category2.id,
        parent_id: measurement.id
      }
    ]
  })

  console.log('Base data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 