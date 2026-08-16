/*
  Warnings:

  - You are about to drop the column `year` on the `academicYear` table. All the data in the column will be lost.
  - Added the required column `monthEnd` to the `academicYear` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthStart` to the `academicYear` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearEnd` to the `academicYear` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearStart` to the `academicYear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academicYear" DROP COLUMN "year",
ADD COLUMN     "monthEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "monthStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "yearEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "yearStart" TIMESTAMP(3) NOT NULL;
