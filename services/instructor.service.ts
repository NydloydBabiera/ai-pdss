import { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { isInstructorDataExist, isInstructorEmailExists, isInstructorExists } from "./business/instructor.business";
import { hashPassword } from "@/lib/auth/password";
import { InstructorData, InstructorType } from "@/_config/instructorConfig";




export async function createInstructor(instructorType: InstructorType): Promise<InstructorData> {

    return await prisma.$transaction(async (tx) => {

        // Verify instructor doesn't already exist
        await isInstructorExists(instructorType);

        // Verify email doesn't already exist
        await isInstructorEmailExists(instructorType);

        // Create instructor
        const instructor = await tx.instructor.create({
            data: {
                ...instructorType,
                isActive: true
            }
        });

        const hashedPassword = await hashPassword(instructorType.email);
        // Create instructor account
        await tx.account.create({
            data: {
                email: instructorType.email,
                password: hashedPassword,
                isFirstLogin: true,
                instructorId: instructor.id,
                Role: Role.TEACHER,
                token: "",
                isActive: true
            }
        })



        return instructor;
    });

}

export async function fetchInstructors(): Promise<InstructorData[]> {
    const instructors = await prisma.instructor.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })

    return instructors ?? []
}

export async function fetchInstructor(id: number): Promise<InstructorData> {
    await isInstructorDataExist(id)

    return prisma.instructor.findUniqueOrThrow({ where: { id } })
}

export async function updateInstructor(id: number, instructorType: InstructorType): Promise<InstructorData> {

    await isInstructorDataExist(id)

    return prisma.$transaction(async (tx) => {
        const instructor = await tx.instructor.update({
            where: { id },
            data: instructorType
        })

        await tx.account.updateMany({
            where: { instructorId: id },
            data: { email: instructorType.email }
        })

        return instructor
    })
}

export async function deleteInstructor(id: number): Promise<InstructorData> {

    await isInstructorDataExist(id)

    return prisma.$transaction(async (tx) => {
        const account = await tx.account.findUnique({
            where: { instructorId: id },
            select: { id: true }
        })

        if (account) {
            await tx.accountSession.deleteMany({
                where: { accountId: account.id }
            })

            await tx.account.delete({
                where: { id: account.id }
            })
        }

        return tx.instructor.delete({
            where: { id }
        })
    })
};
