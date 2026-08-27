import { ScheduleType } from "@/_config/scheduleConfig";
import { prisma } from "@/lib/prisma";

export async function isScheduleOverlap(data: ScheduleType) {
    const schedule = await prisma.schedule.findFirst({
        where: {
            AND: [
                { subjectId: data?.subjectId },
                { day: data?.day },
                { time: data?.time }

            ]
        },
        select: {
            subjectId: true,
            day: true,
            time: true,
        }
    })

    if (schedule) {
        throw new Error("Day and time schedule overlap to another subject")
    }
}
export async function isScheduleExists(id: number) {
    const subject = await prisma.schedule.findFirst({
        where: {
            id: id
        }
    })

    if (!subject) {
        throw new Error("No schedule data found!")
    }
}