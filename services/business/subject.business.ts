import { SubjectType } from "@/_config/subjectConfig"
import { prisma } from "@/lib/prisma"

export async function isSubjectExists(data: SubjectType) {
    const subject = await prisma.subject.findFirst({
        where: {
            OR: [
                { title: data?.title },
                { description: data?.description },
                { code: data?.code }
            ]
        },
        select: {
            title: true,
            description: true,
            code: true,
        },
    })

    if (subject) {
        throw new Error("Subject already exists!")
    }
}

export async function isSubjectDataExists(id: number) {
    const subject = await prisma.subject.findFirst({
        where: {
            id: id
        }
    })

    if (!subject) {
        throw new Error("No subject data found!")
    }
}