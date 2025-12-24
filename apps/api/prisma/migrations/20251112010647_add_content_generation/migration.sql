-- CreateTable
CREATE TABLE "ContentGeneration" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "lastGeneratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentGeneration_key_key" ON "ContentGeneration"("key");
