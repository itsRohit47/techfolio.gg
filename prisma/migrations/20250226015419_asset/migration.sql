-- AlterTable
ALTER TABLE "PortfolioStyle" ADD COLUMN     "assetCardBackground" TEXT NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "assetCardBorder" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "assetCardBorderColor" TEXT NOT NULL DEFAULT '#E5E7EB',
ADD COLUMN     "assetCardBorderRadius" TEXT NOT NULL DEFAULT 'rounded-lg',
ADD COLUMN     "assetCardBorderWidth" TEXT NOT NULL DEFAULT '1px',
ADD COLUMN     "assetCardDescriptionColor" TEXT NOT NULL DEFAULT '#4B5563',
ADD COLUMN     "assetCardHoverScale" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "assetCardHoverShadow" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "assetCardShadow" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "assetCardStyle" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "assetCardTextColor" TEXT NOT NULL DEFAULT '#000000';
