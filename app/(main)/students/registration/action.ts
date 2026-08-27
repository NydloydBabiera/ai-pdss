"use server"
import { StudentDataType, StudentFieldType } from "@/_config/studentConfig";
import { createStudent, deleteStudent, fetchStudent, fetchStudents, updateStudent } from "@/services/student.service";

const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Something went wrong.";

export async function fetchStudentAction(id: number) {
    try {
        return { success: true as const, message: "Student fetched successfully.", data: await fetchStudent(id) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function updateStudentAction(id: number, data: StudentFieldType) {
    try {
        return { success: true as const, message: "Student updated successfully.", data: await updateStudent(id, data) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function deleteStudentAction(id: number) {
    try {
        return { success: true as const, message: "Student deleted successfully.", data: await deleteStudent(id) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}



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
