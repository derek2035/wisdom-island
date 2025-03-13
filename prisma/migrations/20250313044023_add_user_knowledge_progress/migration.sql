-- CreateTable
CREATE TABLE `user_knowledge_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `knowledge_point_id` INTEGER NOT NULL,
    `completed_times` INTEGER NOT NULL DEFAULT 0,
    `last_completed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_knowledge_progress_user_id_knowledge_point_id_key`(`user_id`, `knowledge_point_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_knowledge_progress` ADD CONSTRAINT `user_knowledge_progress_knowledge_point_id_fkey` FOREIGN KEY (`knowledge_point_id`) REFERENCES `knowledge_points`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
