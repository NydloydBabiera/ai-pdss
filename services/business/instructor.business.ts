import { prisma } from "@/lib/prisma";

export async function isInstructorExists(data: any) {
    const student = await prisma.instructor.findFirst({
        where: {
            AND: [
                { firstName: data?.firstName },
                { middleName: data?.middleName },
                { lastName: data?.lastName }
            ]
        },
        select: {
            firstName: true,
            middleName: true,
            lastName: true,
        },
    })

    if (student) {
        throw new Error("Instructor already exists!")
    }
}

export async function isInstructorEmailExists(data: any) {
    const student = await prisma.instructor.findFirst({
        where: {
            email: data.email
        }
    })

    if (student) {
        throw new Error("Email is already in use by another instructor!")
    }
}

export async function isInstructorDataExist(id: number) {
    const student = await prisma.instructor.findFirst({
        where: {
            id
        }
    })

    if (!student) {
        throw new Error("No data found!")
    }
}
