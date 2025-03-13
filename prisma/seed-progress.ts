import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 获取所有知识点
  const knowledgePoints = await prisma.knowledgePoint.findMany()
  
  // 为每个知识点随机生成进度
  for (const point of knowledgePoints) {
    // 70% 的概率生成进度记录
    if (Math.random() < 0.7) {
      // 随机生成1-4次完成记录
      const completedTimes = Math.floor(Math.random() * 4) + 1
      
      // 生成随机的最后完成时间（过去30天内）
      const daysAgo = Math.floor(Math.random() * 30)
      const lastCompletedAt = new Date()
      lastCompletedAt.setDate(lastCompletedAt.getDate() - daysAgo)
      
      await prisma.userKnowledgeProgress.upsert({
        where: {
          user_id_knowledge_point_id: {
            user_id: "1",
            knowledge_point_id: point.id
          }
        },
        update: {
          completed_times: completedTimes,
          last_completed_at: lastCompletedAt
        },
        create: {
          user_id: "1",
          knowledge_point_id: point.id,
          completed_times: completedTimes,
          last_completed_at: lastCompletedAt
        }
      })

      console.log(`Created/Updated progress for knowledge point ${point.title}`)
    }
  }
  
  console.log('Random progress records created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 