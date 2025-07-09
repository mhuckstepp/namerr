-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_names" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "origin" TEXT,
    "feedback" TEXT,
    "middleNames" TEXT[],
    "similarNames" TEXT[],
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_names_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "saved_names_userId_savedAt_idx" ON "saved_names"("userId", "savedAt");

-- CreateIndex
CREATE INDEX "saved_names_userId_firstName_lastName_idx" ON "saved_names"("userId", "firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "saved_names_userId_firstName_lastName_key" ON "saved_names"("userId", "firstName", "lastName");

-- AddForeignKey
ALTER TABLE "saved_names" ADD CONSTRAINT "saved_names_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
