import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const progressRecords = await prisma.userKnowledgeProgress.findMany({
    where: {
      user_id: "1"
    },
    include: {
      knowledge_point: true
    }
  })

  console.log(`Found ${progressRecords.length} learning progress records for user 1:`)
  progressRecords.forEach(record => {
    console.log(`- ${record.knowledge_point.title}: Completed ${record.completed_times} times, Last completed at ${record.last_completed_at}`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 