/*
  Warnings:

  - You are about to drop the column `feedbackQuality` on the `prompt_feedback` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `prompt_feedback` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "prompt_feedback_promptId_feedbackQuality_idx";

-- AlterTable
ALTER TABLE "prompt_feedback" DROP COLUMN "feedbackQuality",
DROP COLUMN "sessionId";
