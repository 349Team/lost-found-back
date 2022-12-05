/*
  Warnings:

  - You are about to drop the column `nickname` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ra]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ra` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_ibfk_1";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_image_id_fkey";

-- DropIndex
DROP INDEX "email";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "nickname",
ADD COLUMN     "email" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "ra" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "Person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ra" ON "User"("ra");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
