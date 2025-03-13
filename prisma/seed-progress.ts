import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 获取所有知识点
  const knowledgePoints = await prisma.knowledgePoint.findMany()
  
  // 为用户ID 1 创建随机学习记录
  for (const point of knowledgePoints) {
    // 70%的概率创建学习记录
    if (Math.random() < 0.7) {
      // 随机完成次数 (1-4次)
      const completedTimes = Math.floor(Math.random() * 4) + 1
      
      await prisma.userKnowledgeProgress.create({
        data: {
          user_id: "1",
          knowledge_point_id: point.id,
          completed_times: completedTimes,
          last_completed_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 随机过去30天内的时间
        }
      })
    }
  }

  console.log('Random learning progress data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 