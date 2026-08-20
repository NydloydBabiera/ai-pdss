"use server"

import { SubjectType } from "@/_config/subjectConfig";
import { createSubject, fetchSubjects } from "@/services/subject.service";

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