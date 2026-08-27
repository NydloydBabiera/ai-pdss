"use server"
import { InstructorData, InstructorType } from "@/_config/instructorConfig";
import { createInstructor, deleteInstructor, fetchInstructor, fetchInstructors, updateInstructor } from "@/services/instructor.service";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Something went wrong.";
}


export async function createInstructorAction(data: InstructorType) {
    try {

        const instructor =
            await createInstructor(data);

        return {
            success: true,
            message: "Instructor added successfully.",
            data: instructor,
        };
    } catch (error) {
        console.error(
            "createInstructorAction:",
            error
        );

        return {
            success: false,
            message: error,
        };
    }
}

export async function fetchInstructorAction(id: number) {
    try {
        const instructor = await fetchInstructor(id);
        return { success: true as const, message: "Instructor fetched successfully.", data: instructor };
    } catch (error) {
        console.error("fetchInstructorAction:", error);
        return { success: false as const, message: getErrorMessage(error) };
    }
}

export async function updateInstructorAction(id: number, data: InstructorType) {
    try {
        const instructor = await updateInstructor(id, data);
        return { success: true as const, message: "Instructor updated successfully.", data: instructor };
    } catch (error) {
        console.error("updateInstructorAction:", error);
        return { success: false as const, message: getErrorMessage(error) };
    }
}

export async function deleteInstructorAction(id: number) {
    try {
        const instructor = await deleteInstructor(id);
        return {
            success: true as const,
            message: "Instructor deleted successfully.",
            data: instructor,
        };
    } catch (error) {
        console.error("deleteInstructorAction:", error);
        return {
            success: false as const,
            message: getErrorMessage(error),
        };
    }
}

export async function fetchInstructorsActions() {
    try {
        const instructors: InstructorData[] = await fetchInstructors()

        return {
            success: true,
            message: "Instructor fetched successfully.",
            data: instructors,
        };
    } catch (error) {
        console.error(
            "fetchInstructors:",
            error
        );

        return {
            success: false,
            message: "Something went wrong in fetchInstructors",
        };
    }
}

