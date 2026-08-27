"use server"

import { SubjectType } from "@/_config/subjectConfig";
import { createSubject, deleteSubject, fetchSubject, fetchSubjects, updateSubject } from "@/services/subject.service";

const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Something went wrong.";

export async function updateSubjectAction(id: number, data: SubjectType) {
    try {
        return { success: true as const, message: "Subject updated successfully.", data: await updateSubject(id, data) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function deleteSubjectAction(id: number) {
    try {
        return { success: true as const, message: "Subject deleted successfully.", data: await deleteSubject(id) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function createSubjectAction(data: SubjectType) {
    try {

        const subject = await createSubject(data);

        return {
            success: true,
            message: "Subject added successfully.",
            data: subject
        }

    } catch (error) {
        console.error(
            "createSubjectAction:",
            error
        );

        return {
            success: false,
            message: error,
        };
    }
}

export async function fetchSubjectsAction() {
    try {
        const subjects = await fetchSubjects();

        return {
            success: true,
            message: "Subjects fetched successfully.",
            data: subjects,
        };
    } catch (error) {
        console.error(
            "fetchSubjects:",
            error
        );

        return {
            success: false,
            message: error,
        };
    }
}

export async function fetchSubjectAction(id: number) {
    try {
        return {
            success: true as const,
            message: "Subject fetched successfully",
            data: await fetchSubject(id)
        }
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}
