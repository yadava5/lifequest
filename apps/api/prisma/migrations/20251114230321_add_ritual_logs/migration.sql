-- CreateTable
CREATE TABLE "RitualLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RitualLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RitualLog_userId_createdAt_idx" ON "RitualLog"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "RitualLog" ADD CONSTRAINT "RitualLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
