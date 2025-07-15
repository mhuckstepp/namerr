-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "families" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inviteToken" TEXT,

    CONSTRAINT "families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_names" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'FEMALE',
    "origin" TEXT,
    "popularity" TEXT,
    "feedback" TEXT,
    "middleNames" TEXT[],
    "similarNames" TEXT[],
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "saved_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "name_cache" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'FEMALE',
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
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "families_inviteToken_key" ON "families"("inviteToken");

-- CreateIndex
CREATE INDEX "saved_names_familyId_savedAt_idx" ON "saved_names"("familyId", "savedAt");

-- CreateIndex
CREATE INDEX "saved_names_familyId_firstName_lastName_idx" ON "saved_names"("familyId", "firstName", "lastName");

-- CreateIndex
CREATE INDEX "saved_names_familyId_gender_idx" ON "saved_names"("familyId", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "saved_names_firstName_lastName_gender_familyId_key" ON "saved_names"("firstName", "lastName", "gender", "familyId");

-- CreateIndex
CREATE INDEX "name_cache_firstName_lastName_idx" ON "name_cache"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "name_cache_lastName_gender_idx" ON "name_cache"("lastName", "gender");

-- CreateIndex
CREATE INDEX "name_cache_lastAccessed_idx" ON "name_cache"("lastAccessed");

-- CreateIndex
CREATE INDEX "name_cache_accessCount_idx" ON "name_cache"("accessCount");

-- CreateIndex
CREATE UNIQUE INDEX "name_cache_firstName_lastName_gender_key" ON "name_cache"("firstName", "lastName", "gender");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_names" ADD CONSTRAINT "saved_names_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;
