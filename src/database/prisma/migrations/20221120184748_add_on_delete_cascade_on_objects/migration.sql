-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_object_id_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnObjects" DROP CONSTRAINT "TagsOnObjects_object_id_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnObjects" DROP CONSTRAINT "TagsOnObjects_tag_id_fkey";

-- AddForeignKey
ALTER TABLE "TagsOnObjects" ADD CONSTRAINT "TagsOnObjects_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnObjects" ADD CONSTRAINT "TagsOnObjects_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;
