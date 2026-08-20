/*
  Warnings:

  - You are about to drop the column `monthEnd` on the `academicYear` table. All the data in the column will be lost.
  - You are about to drop the column `monthStart` on the `academicYear` table. All the data in the column will be lost.
  - You are about to drop the column `yearEnd` on the `academicYear` table. All the data in the column will be lost.
  - You are about to drop the column `yearStart` on the `academicYear` table. All the data in the column will be lost.
  - Added the required column `end` to the `academicYear` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `academicYear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academicYear" DROP COLUMN "monthEnd",
DROP COLUMN "monthStart",
DROP COLUMN "yearEnd",
DROP COLUMN "yearStart",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
