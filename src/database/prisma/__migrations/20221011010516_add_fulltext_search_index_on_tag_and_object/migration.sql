-- CreateIndex
CREATE FULLTEXT INDEX `Object_title_description_idx` ON `Object`(`title`, `description`);

-- CreateIndex
CREATE FULLTEXT INDEX `Tag_title_description_idx` ON `Tag`(`title`, `description`);
