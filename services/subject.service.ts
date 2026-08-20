import { SubjectData, SubjectType } from "@/_config/subjectConfig";
import { prisma } from "@/lib/prisma";
import { isSubjectExists } from "./business/subject.business";

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