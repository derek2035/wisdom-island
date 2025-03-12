-- CreateTable
CREATE TABLE `knowledge_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `knowledge_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_points` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `grade` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `order_index` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `parent_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `knowledge_points` ADD CONSTRAINT `knowledge_points_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `knowledge_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge_points` ADD CONSTRAINT `knowledge_points_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `knowledge_points`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
