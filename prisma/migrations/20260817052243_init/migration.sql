/*
  Warnings:

  - A unique constraint covering the columns `[idCode]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "studentSequence" (
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "studentSequence_pkey" PRIMARY KEY ("year")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_idCode_key" ON "student"("idCode");
