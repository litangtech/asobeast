-- AlterTable
ALTER TABLE "Keyword" ADD COLUMN     "rankRecheckAfter" TIMESTAMP(3),
ADD COLUMN     "rankRecheckApps" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rankRecheckHasValidMiss" BOOLEAN NOT NULL DEFAULT false;
