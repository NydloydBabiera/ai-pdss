"use server"
import { InstructorData, InstructorType } from "@/_config/instructorConfig";
import { Gender } from "@/generated/prisma/enums";
import { createInstructor, fetchInstructors } from "@/services/instructor.service";


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

export async function fetchInstructorsActions(){
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

