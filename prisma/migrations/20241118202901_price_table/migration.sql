/*
  Warnings:

  - Added the required column `currency` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceIn` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "priceIn" TEXT NOT NULL;
