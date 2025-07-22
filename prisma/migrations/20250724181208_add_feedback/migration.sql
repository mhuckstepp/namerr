-- AlterTable
ALTER TABLE "prompt_history" ADD COLUMN     "averageFeedbackQuality" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "lastFeedbackAt" TIMESTAMP(3),
ADD COLUMN     "totalFeedbackCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "prompt_feedback" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "analysisFeedback" TEXT,
    "analysisFeedbackQuant" DOUBLE PRECISION,
    "originFeedback" TEXT,
    "originFeedbackQuant" DOUBLE PRECISION,
    "popularityFeedback" TEXT,
    "popularityFeedbackQuant" DOUBLE PRECISION,
    "similarNamesFeedback" TEXT,
    "similarNamesFeedbackQuant" DOUBLE PRECISION,
    "middleNamesFeedback" TEXT,
    "middleNamesFeedbackQuant" DOUBLE PRECISION,
    "userId" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedbackQuality" INTEGER,

    CONSTRAINT "prompt_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_feedback_promptId_createdAt_idx" ON "prompt_feedback"("promptId", "createdAt");

-- CreateIndex
CREATE INDEX "prompt_feedback_promptId_feedbackQuality_idx" ON "prompt_feedback"("promptId", "feedbackQuality");

-- CreateIndex
CREATE INDEX "prompt_feedback_userId_createdAt_idx" ON "prompt_feedback"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "prompt_feedback" ADD CONSTRAINT "prompt_feedback_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompt_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_feedback" ADD CONSTRAINT "prompt_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
