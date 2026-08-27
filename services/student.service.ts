import { prisma } from "@/lib/prisma";
import { generateStudentIdCode, isStudentDataExist, isStudentEmailExists, isStudentExists } from "./business/students.business";
import { StudentDataType, StudentFieldType } from "@/_config/studentConfig";



export async function createStudent(studentType: StudentFieldType): Promise<StudentFieldType> {

    console.log("🚀 ~ createStudent ~ studentType:", studentType)
    return await prisma.$transaction(async (tx) => {
        await isStudentExists(studentType);

        await isStudentEmailExists(studentType);

        const idCode = await generateStudentIdCode(tx);

        const student = await tx.student.create({
            data: {
                ...studentType,
                isActive: true,
                idCode: idCode
            }
        })

        return student;
    })


}

export async function fetchStudents(): Promise<StudentDataType[]> {
    const data = await prisma.student.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })

    return data;
}

export async function fetchStudent(id: number): Promise<StudentDataType> {
    await isStudentDataExist(id);
    return prisma.student.findUniqueOrThrow({ where: { id } });
}

export async function updateStudent(id: number, studentType: StudentFieldType): Promise<StudentDataType> {

    await isStudentDataExist(id);

    const student = await prisma.student.update({
        where: {
            id: id,
        },
        data: studentType
    })

    return student
}

export async function deleteStudent(id: number): Promise<StudentDataType> {

    await isStudentDataExist(id);

    return prisma.$transaction(async (tx) => {
        await tx.studentLevel.deleteMany({ where: { studentId: id } });
        return tx.student.delete({ where: { id } });
    })
}
