"use server"

import { AcademicYearData, AcademicYearType } from "@/_config/academicYearConfig";
import { createAcademicYear, fetchAcademicYear } from "@/services/academic.service";

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



