import { prisma } from "@/lib/prisma"

export async function isSubjectExists(data: any) {
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