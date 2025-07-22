-- CreateTable
CREATE TABLE "prompt_history" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "topP" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "minTokens" INTEGER NOT NULL DEFAULT 0,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.35,
    "presencePenalty" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "modelName" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 1,
    "firstUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_history_modelName_lastUsed_idx" ON "prompt_history"("modelName", "lastUsed");

-- CreateIndex
CREATE INDEX "prompt_history_lastUsed_idx" ON "prompt_history"("lastUsed");

-- CreateIndex
CREATE INDEX "prompt_history_usageCount_idx" ON "prompt_history"("usageCount");
