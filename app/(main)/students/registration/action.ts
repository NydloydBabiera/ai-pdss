"use server"
import { StudentDataType, StudentFieldType } from "@/_config/studentConfig";
import { Gender } from "@/generated/prisma/enums";
import { createStudent, fetchStudents } from "@/services/student.service";



export async function createStudentAction(data: StudentFieldType) {
    try {

        const student = await createStudent(data);

        return {
            success: true,
            message: "Student added successfully.",
            data: student,
        };
    } catch (error) {
        console.error(
            "createStudentAction:",
            error
        );

        return {
            success: false,
            message: "Something went wrong.",
        };
    }
}

export async function fetchStudentsAction() {
    try {

        const students: StudentDataType[] = await fetchStudents();

        return {
            success: true,
            message: "Students fetched successfully.",
            data: students,
        };
    } catch (error) {
        console.error(
            "fetchStudentsAction:",
            error
        );

        return {
            success: false,
            message: error,
        };
    }
}