import { SubjectData, SubjectType } from "@/_config/subjectConfig";
import { prisma } from "@/lib/prisma";
import { isSubjectDataExists, isSubjectExists } from "./business/subject.business";

export async function createSubject(subjectType: SubjectType): Promise<SubjectData> {

    await isSubjectExists(subjectType);

    const subject = await prisma.subject.create({
        data: {
            ...subjectType,
            isActive: true,
        }
    })

    return subject;
}

export async function fetchSubjects(): Promise<SubjectData[]> {
    const data = await prisma.subject.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })

    return data;
}

export async function updateSubject(id: number, subjectType: SubjectType): Promise<SubjectData> {
    return prisma.subject.update({ where: { id }, data: subjectType });
}

export async function deleteSubject(id: number): Promise<SubjectData> {
    return prisma.$transaction(async (tx) => {
        await tx.schedule.updateMany({ where: { subjectId: id }, data: { subjectId: null } });
        return tx.subject.delete({ where: { id } });
    });
}

export async function fetchSubject(id: number): Promise<SubjectData> {
    await isSubjectDataExists(id)

    return prisma.subject.findUniqueOrThrow({ where: { id } });
}