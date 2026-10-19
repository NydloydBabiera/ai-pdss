"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/account.service";

async function requireAccess() {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "TEACHER"].includes(user.role)) {
    throw new Error("You do not have permission to manage subject assignments.");
  }
}

export async function fetchSubjectAssignmentsAction() {
  try {
    await requireAccess();
    const [levels, subjects] = await Promise.all([
      prisma.academicLevel.findMany({
        orderBy: [{ department: "asc" }, { level: "asc" }, { class: "asc" }],
        select: { id: true, department: true, level: true, class: true, subjectAssignments: { select: { subjectId: true } } },
      }),
      prisma.subject.findMany({
        orderBy: [{ code: "asc" }, { title: "asc" }],
        select: { id: true, code: true, title: true, description: true, isActive: true },
      }),
    ]);
    return { success: true as const, data: { levels, subjects } };
  } catch (error) {
    console.error("fetchSubjectAssignmentsAction:", error);
    return { success: false as const, message: "Unable to load subject assignments. Please try again." };
  }
}

export async function saveSubjectAssignmentsAction(levelId: number, subjectIds: number[]) {
  try {
    await requireAccess();
    if (!Number.isSafeInteger(levelId) || levelId <= 0 || !Array.isArray(subjectIds) ||
      subjectIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
      return { success: false as const, message: "Select a valid academic level and subjects." };
    }
    const ids = [...new Set(subjectIds)];
    await prisma.$transaction(async (tx) => {
      const level = await tx.academicLevel.findUniqueOrThrow({
        where: { id: levelId },
        select: { subjectAssignments: { select: { subjectId: true } } },
      });
      const existingIds = level.subjectAssignments.map((item) => item.subjectId);
      const count = await tx.subject.count({
        where: { id: { in: ids }, OR: [{ isActive: true }, { id: { in: existingIds } }] },
      });
      if (count !== ids.length) throw new Error("Invalid subjects");
      await tx.subjectAssignment.deleteMany({ where: { academicLevelId: levelId, subjectId: { notIn: ids } } });
      await tx.subjectAssignment.createMany({
        data: ids.map((subjectId) => ({ academicLevelId: levelId, subjectId })),
        skipDuplicates: true,
      });
    });
    return { success: true as const, message: "Subject assignments saved." };
  } catch (error) {
    console.error("saveSubjectAssignmentsAction:", error);
    return { success: false as const, message: "Unable to save assignments. Reload the page and try again." };
  }
}
