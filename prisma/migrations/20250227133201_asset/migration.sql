-- AlterTable
ALTER TABLE "PortfolioStyle" ADD COLUMN     "assetTabBackground" TEXT NOT NULL DEFAULT '#F3F4F6',
ADD COLUMN     "assetTabSelectedBg" TEXT NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "assetTabSelectedTextColor" TEXT NOT NULL DEFAULT '#111827',
ADD COLUMN     "assetTabTextColor" TEXT NOT NULL DEFAULT '#6B7280',
ADD COLUMN     "categorizeAssets" BOOLEAN NOT NULL DEFAULT true;
