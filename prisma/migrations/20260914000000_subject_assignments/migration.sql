CREATE TABLE "subjectAssignment" (
    "academicLevelId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    CONSTRAINT "subjectAssignment_pkey" PRIMARY KEY ("academicLevelId", "subjectId")
);

CREATE INDEX "subjectAssignment_subjectId_idx" ON "subjectAssignment"("subjectId");

ALTER TABLE "subjectAssignment" ADD CONSTRAINT "subjectAssignment_academicLevelId_fkey" FOREIGN KEY ("academicLevelId") REFERENCES "academicLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subjectAssignment" ADD CONSTRAINT "subjectAssignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
