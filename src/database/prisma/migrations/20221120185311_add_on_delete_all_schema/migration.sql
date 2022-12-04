-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_discoverer_id_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_image_id_fkey";

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_discoverer_id_fkey" FOREIGN KEY ("discoverer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
