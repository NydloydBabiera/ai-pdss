/*
  Warnings:

  - Added the required column `Role` to the `account` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `instructor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gender` on the `student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "Role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "instructor" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "student" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;
