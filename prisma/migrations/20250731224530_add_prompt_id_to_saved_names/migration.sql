-- AlterTable
ALTER TABLE "name_cache" ADD COLUMN     "promptId" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "saved_names" ADD COLUMN     "promptId" TEXT DEFAULT '';
