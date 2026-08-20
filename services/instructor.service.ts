import { Gender, Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { isInstructorDataExist, isInstructorEmailExists, isInstructorExists } from "./business/instructor.business";
import { hashPassword } from "@/lib/auth/password";
import { InstructorData, InstructorType } from "@/_config/instructorConfig";

// type InstructorType = {
//     id: number;
//     firstName: string;
//     middleName: string;
//     lastName: string;
//     email: string;
//     age: number;
//     birthDate: Date;
//     gender: Gender;
//     address: string;
//     isActive: boolean;
// }

// type ReturnMessage = {
//     status: string;
//     message: string;
//     data: InstructorType;
// }



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

export async function updateInstructor(id: number, instructorType: InstructorType): Promise<InstructorData> {

    await isInstructorDataExist(id)

    const instructor = await prisma.instructor.update({
        where: {
            id: id
        },
        data: instructorType
    })

    return instructor;
}

export async function deleteInstructor(id: number): Promise<InstructorData> {

    await isInstructorDataExist(id)

    const deletedData = await prisma.instructor.delete({
        where: {
            id: id
        }
    })

    return deletedData;
};
