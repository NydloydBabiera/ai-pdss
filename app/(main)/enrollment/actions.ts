"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/account.service";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") throw new Error("Only administrators can manage enrollment.");
}

export async function fetchEnrollmentAction() {
  try {
    await requireAdmin();
    const [students, levels, years, enrollments] = await Promise.all([
      prisma.student.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }], select: { id: true, idCode: true, firstName: true, middleName: true, lastName: true, isActive: true } }),
      prisma.academicLevel.findMany({ orderBy: [{ department: "asc" }, { level: "asc" }, { class: "asc" }], select: { id: true, department: true, level: true, class: true } }),
      prisma.academicYear.findMany({ orderBy: { start: "desc" }, select: { id: true, start: true, end: true, isCurrent: true } }),
      prisma.studentLevel.findMany({ select: { id: true, studentId: true, academicLevelId: true, academicYearId: true } }),
    ]);
    return { success: true as const, data: { students, levels, years, enrollments } };
  } catch (error) {
    console.error("fetchEnrollmentAction:", error);
    return { success: false as const, message: "Unable to load enrollment. Please try again." };
  }
}

export async function saveEnrollmentAction(yearId: number, levelId: number, studentIds: number[]) {
  try {
    await requireAdmin();
    const validId = (id: number) => Number.isSafeInteger(id) && id > 0;
    if (!validId(yearId) || !validId(levelId) || !Array.isArray(studentIds) || !studentIds.length || studentIds.some((id) => !validId(id))) {
      return { success: false as const, message: "Select an academic year, grade level, and at least one student." };
    }
    const ids = [...new Set(studentIds)];
    const data = await prisma.$transaction(async (tx) => {
      await tx.academicYear.findUniqueOrThrow({ where: { id: yearId } });
      await tx.academicLevel.findUniqueOrThrow({ where: { id: levelId } });
      if (await tx.student.count({ where: { id: { in: ids }, isActive: true } }) !== ids.length) throw new Error("Students are no longer available.");
      // Replace only the selected students' enrollment in this year, including any legacy duplicates.
      await tx.studentLevel.deleteMany({ where: { academicYearId: yearId, studentId: { in: ids } } });
      await tx.studentLevel.createMany({ data: ids.map((studentId) => ({ studentId, academicYearId: yearId, academicLevelId: levelId })) });
      return tx.studentLevel.findMany({ where: { academicYearId: yearId }, select: { id: true, studentId: true, academicLevelId: true, academicYearId: true } });
    }, { isolationLevel: "Serializable" });
    return { success: true as const, message: "Enrollment saved.", data };
  } catch (error) {
    console.error("saveEnrollmentAction:", error);
    return { success: false as const, message: "Unable to save enrollment. Refresh and try again." };
  }
}

export async function removeEnrollmentAction(id: number) {
  try {
    await requireAdmin();
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Invalid enrollment.");
    await prisma.studentLevel.delete({ where: { id } });
    return { success: true as const, message: "Enrollment removed." };
  } catch (error) {
    console.error("removeEnrollmentAction:", error);
    return { success: false as const, message: "Unable to remove enrollment. Refresh and try again." };
  }
}
