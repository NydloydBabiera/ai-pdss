"use server"

import { AcademicLevelData, AcademicLevelType } from "@/_config/levelsConfig";
import { createAcademicLevel, deleteAcademicLevel, fetchAcademicLevels, updateAcademicLevel } from "@/services/academic.service";

const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Something went wrong.";

export async function updateAcademicLevelAction(id: number, data: AcademicLevelType) {
    try {
        return { success: true as const, message: "Academic level updated successfully.", data: await updateAcademicLevel(id, data) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function deleteAcademicLevelAction(id: number) {
    try {
        return { success: true as const, message: "Academic level deleted successfully.", data: await deleteAcademicLevel(id) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function createAcademicLevelAction(data: AcademicLevelType) {
    try {
        const level = await createAcademicLevel(data);

        return {
            success: true,
            message: "Academic level added successfully.",
            data: level,
        };
    } catch (error) {
        console.error(
            "createAcademicLevelAction:",
            error
        );

        return {
            success: false,
            message: error,
        };
    }
}

export async function fetchAcademicLevelsAction() {
    try {
        const levels: AcademicLevelData[] = await fetchAcademicLevels();


        return {
            success: true,
            message: "Academic levels fetched successfully.",
            data: levels,
        };
    } catch (error) {
        console.error(
            "fetchAcademicLevelsAction:",
            error
        );

        return {
            success: false,
            message: error,
        };
    }
}
