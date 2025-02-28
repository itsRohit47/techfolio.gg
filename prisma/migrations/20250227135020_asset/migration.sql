-- AlterTable
ALTER TABLE "PortfolioStyle" ADD COLUMN     "assetTabBorder" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "assetTabBorderColor" TEXT NOT NULL DEFAULT '#E5E7EB',
ADD COLUMN     "assetTabBorderRadius" TEXT NOT NULL DEFAULT 'rounded-lg',
ADD COLUMN     "assetTabHoverBg" TEXT NOT NULL DEFAULT '#F3F4F6',
ADD COLUMN     "assetTabPadding" TEXT NOT NULL DEFAULT 'px-4 py-2',
ADD COLUMN     "assetTabSpacing" TEXT NOT NULL DEFAULT 'gap-2';
