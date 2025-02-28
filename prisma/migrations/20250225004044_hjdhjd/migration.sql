-- CreateTable
CREATE TABLE "PortfolioStyle" (
    "id" TEXT NOT NULL,
    "background" TEXT NOT NULL DEFAULT 'bg-white',
    "nameColor" TEXT NOT NULL DEFAULT 'text-black',
    "descriptionColor" TEXT NOT NULL DEFAULT 'text-gray-600',
    "linkColor" TEXT NOT NULL DEFAULT 'text-blue-500',
    "layoutSize" TEXT NOT NULL DEFAULT 'MD',
    "elementSpacing" TEXT NOT NULL DEFAULT 'NORMAL',
    "headerAlignment" TEXT NOT NULL DEFAULT 'left',
    "showDescription" BOOLEAN NOT NULL DEFAULT true,
    "showLinks" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioStyle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioStyle_userId_key" ON "PortfolioStyle"("userId");

-- AddForeignKey
ALTER TABLE "PortfolioStyle" ADD CONSTRAINT "PortfolioStyle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
