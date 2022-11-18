-- AlterTable
ALTER TABLE `Image` ADD COLUMN `person_id` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `Person` DROP COLUMN `image`,
    ADD COLUMN `image_id` INTEGER UNSIGNED NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Person_user_id_key` ON `Person`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Person_image_id_key` ON `Person`(`image_id`);

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
