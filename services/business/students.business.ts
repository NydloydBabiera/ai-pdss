import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function isStudentExists(data: any) {
    const student = await prisma.student.findFirst({
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
        throw new Error("Student already exists!")
    }
}

export async function isStudentEmailExists(data: any) {
    const student = await prisma.student.findFirst({
        where: {
            email: data.email
        }
    })

    if (student) {
        throw new Error("Email is already in use of another student!")
    }
}

export async function isStudentDataExist(id: number) {
    const student = await prisma.student.findFirst({
        where: {
            id: id
        }
    })

    if (!student) {
        throw new Error("No data found!")
    }
}

export async function generateStudentIdCode(
    tx: Prisma.TransactionClient
): Promise<string> {

    const year = new Date().getFullYear();

    const sequence = await tx.studentSequence.upsert({
        where: {
            year,
        },
        update: {
            lastNumber: {
                increment: 1,
            },
        },
        create: {
            year,
            lastNumber: 1,
        },
    });

    return `${year}${sequence.lastNumber
        .toString()
        .padStart(6, "0")}`;
}