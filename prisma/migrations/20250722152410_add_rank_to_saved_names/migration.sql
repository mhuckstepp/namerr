-- AlterTable
ALTER TABLE "saved_names" ADD COLUMN     "rank" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "saved_names_familyId_rank_idx" ON "saved_names"("familyId", "rank");
