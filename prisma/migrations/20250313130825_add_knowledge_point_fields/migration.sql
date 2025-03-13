/*
  Warnings:

  - Added the required column `keyPoints` to the `knowledge_points` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objective` to the `knowledge_points` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `knowledge_points` ADD COLUMN `keyPoints` JSON NULL,
    ADD COLUMN `objective` TEXT NULL;

-- Update existing records with default values
UPDATE `knowledge_points` 
SET `objective` = CONCAT('掌握', title, '的核心概念和应用'),
    `keyPoints` = JSON_ARRAY('理解基本概念', '掌握关键技能', '能够实际应用');

-- Make columns required after setting default values
ALTER TABLE `knowledge_points` 
MODIFY COLUMN `objective` TEXT NOT NULL,
MODIFY COLUMN `keyPoints` JSON NOT NULL;
