-- AlterTable
ALTER TABLE "PortfolioStyle" ADD COLUMN     "footerButtonEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "footerButtonPhone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "footerButtonType" TEXT NOT NULL DEFAULT 'link';
