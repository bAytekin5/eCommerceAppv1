/*
  Warnings:

  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "stock" DROP DEFAULT,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFACode" TEXT,
ADD COLUMN     "twoFAExpiresAt" TIMESTAMP(3);
