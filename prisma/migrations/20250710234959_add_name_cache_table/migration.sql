-- CreateTable
CREATE TABLE "name_cache" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "origin" TEXT,
    "popularity" TEXT,
    "feedback" TEXT,
    "middleNames" TEXT[],
    "similarNames" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "name_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "name_cache_firstName_lastName_idx" ON "name_cache"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "name_cache_lastAccessed_idx" ON "name_cache"("lastAccessed");

-- CreateIndex
CREATE INDEX "name_cache_accessCount_idx" ON "name_cache"("accessCount");

-- CreateIndex
CREATE UNIQUE INDEX "name_cache_firstName_lastName_key" ON "name_cache"("firstName", "lastName");
