"use server"

import { AcademicYearData, AcademicYearType } from "@/_config/academicYearConfig";
import { createAcademicYear, deleteAcademicYear, fetchAcademicYear, updateAcademicYear } from "@/services/academic.service";

const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Something went wrong.";

export async function updateAcademicYearAction(id: number, data: AcademicYearType) {
    try {
        return { success: true as const, message: "Academic year updated successfully.", data: await updateAcademicYear(id, data) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function deleteAcademicYearAction(id: number) {
    try {
        return { success: true as const, message: "Academic year deleted successfully.", data: await deleteAcademicYear(id) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function createAcademicYearAction(data: AcademicYearType) {
    try {
        const academicYear = await createAcademicYear(data);

        return {
            success: true,
            message: "Academic year started successfully.",
            data: academicYear
        }
    } catch (error) {
        console.error(
            "createAcademicYearAction:",
            error
        );

        return {
            success: false,
            message: "Error in createAcademicYearAction",
        };
    }
}

export async function fetchAcademicYearAction() {
    try {

        const academicYears: AcademicYearData[] = await fetchAcademicYear();

        return {
            success: true,
            message: "Academic level added successfully.",
            data: academicYears
        }
    } catch (error) {
        console.error(
            "fetchAcademicYearAction:",
            error
        );

        return {
            success: false,
            message: "Error in fetchAcademicYearAction",
        };
    }
}



