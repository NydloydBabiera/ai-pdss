"use server"

import { AcademicLevelData, AcademicLevelType } from "@/_config/levelsConfig";
import { createAcademicLevel, fetchAcademicLevels } from "@/services/academic.service";

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