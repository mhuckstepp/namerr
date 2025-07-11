/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName,gender]` on the table `name_cache` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,firstName,lastName,gender]` on the table `saved_names` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "name_cache_firstName_lastName_key";

-- DropIndex
DROP INDEX "saved_names_userId_firstName_lastName_key";

-- AlterTable
ALTER TABLE "name_cache" ADD COLUMN     "gender" TEXT NOT NULL DEFAULT 'boy';

-- AlterTable
ALTER TABLE "saved_names" ADD COLUMN     "gender" TEXT NOT NULL DEFAULT 'boy';

-- CreateIndex
CREATE INDEX "name_cache_lastName_gender_idx" ON "name_cache"("lastName", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "name_cache_firstName_lastName_gender_key" ON "name_cache"("firstName", "lastName", "gender");

-- CreateIndex
CREATE INDEX "saved_names_userId_gender_idx" ON "saved_names"("userId", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "saved_names_userId_firstName_lastName_gender_key" ON "saved_names"("userId", "firstName", "lastName", "gender");
