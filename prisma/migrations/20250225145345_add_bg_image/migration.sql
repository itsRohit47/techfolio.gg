-- AlterTable
ALTER TABLE "PortfolioStyle" ADD COLUMN     "backgroundImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1502783167913-8e718e555a06?q=80&w=2763&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
ADD COLUMN     "backgroundOverlay" TEXT NOT NULL DEFAULT 'bg-black/30';
