-- AlterTable
ALTER TABLE "PortfolioStyle" ADD COLUMN     "showAssetDescription" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showAssetIcon" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showAssetType" BOOLEAN NOT NULL DEFAULT true;
