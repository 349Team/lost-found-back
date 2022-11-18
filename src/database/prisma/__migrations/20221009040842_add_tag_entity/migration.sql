/*
  Warnings:

  - You are about to drop the column `image` on the `Object` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `Object` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Object` DROP COLUMN `image`,
    DROP COLUMN `tag`;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` MEDIUMTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TagsOnObjects` (
    `object_id` INTEGER UNSIGNED NOT NULL,
    `tag_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`object_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TagsOnObjects` ADD CONSTRAINT `TagsOnObjects_object_id_fkey` FOREIGN KEY (`object_id`) REFERENCES `Object`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagsOnObjects` ADD CONSTRAINT `TagsOnObjects_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
