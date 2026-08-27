"use server"

import { ScheduleInput, ScheduleType } from "@/_config/scheduleConfig";
import { createSchedule, createSchedules, deleteSchedule, fetchSchedule, updateSchedule } from "@/services/schedule.service";


const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Something went wrong.";

export async function createScheduleAction(data: ScheduleType) {
    try {
        const schedule = await createSchedule(data);

        return {
            success: true,
            message: "Student added successfully.",
            data: schedule,
        };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function fetchSchedules(id: number) {
    try {
        const subjectSchedules = await fetchSchedule(id);

        return {
            success: true,
            message: "Subject schedule fetched successfully.",
            data: subjectSchedules,
        };

    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function createSchedulesAction(subjectId: number, rows: ScheduleInput[]) {
    try {
        const schedules = await createSchedules(subjectId, rows);
        return { success: true as const, message: "Schedules saved successfully.", data: schedules };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function updateScheduleAction(id: number, input: ScheduleInput) {
    try {
        return { success: true as const, message: "Schedule updated successfully.", data: await updateSchedule(id, input) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}

export async function deleteScheduleAction(id: number) {
    try {
        return { success: true as const, message: "Schedule deleted successfully.", data: await deleteSchedule(id) };
    } catch (error) {
        return { success: false as const, message: errorMessage(error) };
    }
}
