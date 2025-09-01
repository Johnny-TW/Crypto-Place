-- CreateTable
CREATE TABLE "watchlists" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coinId" TEXT NOT NULL,
    "coinName" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "watchlists_userId_coinId_key" ON "watchlists"("userId", "coinId");

-- AddForeignKey
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
