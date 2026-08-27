import { ScheduleData, ScheduleInput, ScheduleType, SubjectScheduleData } from "@/_config/scheduleConfig";
import { prisma } from "@/lib/prisma";
import { isScheduleOverlap } from "./business/schedulee.business";

const DAYS = new Map([
    ["MON", "Monday"], ["TUE", "Tuesday"], ["WED", "Wednesday"],
    ["THU", "Thursday"], ["FRI", "Friday"], ["SAT", "Saturday"], ["SUN", "Sunday"],
]);

function normalizeScheduleInput(row: ScheduleInput) {
    const day = DAYS.get(row.dayCode);
    if (!day || !/^([01]\d|2[0-3]):[0-5]\d$/.test(row.time)) {
        throw new Error("Every schedule needs a valid day and time.");
    }
    return {
        day,
        dayCode: row.dayCode,
        time: new Date(`1970-01-01T${row.time}:00.000Z`),
    };
}

export async function createSchedule(scheduleTye: ScheduleType): Promise<ScheduleData> {
    return await prisma.$transaction(async (tx) => {

        await isScheduleOverlap(scheduleTye)

        const schedule = await tx.schedule.create({
            data: {
                ...scheduleTye,
                isActive: true
            },
            include: {
                subject: true,
            }
        })

        return schedule
    });
}

export async function fetchSchedules(): Promise<ScheduleData[]> {
    const schedules = await prisma.schedule.findMany({
        orderBy: {
            createdAt: "asc"
        },
        include: {
            subject: true
        }
    })

    return schedules
}


export async function fetchSchedule(id: number): Promise<SubjectScheduleData> {
    return prisma.subject.findUniqueOrThrow({
        where: { id },
        include: { schedule: { orderBy: [{ dayCode: "asc" }, { time: "asc" }] } }
    })
}

export async function createSchedules(subjectId: number, rows: ScheduleInput[]): Promise<ScheduleData[]> {
    if (!Number.isInteger(subjectId) || subjectId <= 0) throw new Error("Select a subject.");
    if (!rows.length) throw new Error("Add at least one schedule.");

    const normalized = rows.map((row) => {
        return { subjectId, ...normalizeScheduleInput(row), isActive: true };
    });

    const keys = normalized.map((row) => `${row.dayCode}-${row.time.toISOString()}`);
    if (new Set(keys).size !== keys.length) throw new Error("Duplicate day and time in the schedule list.");

    return prisma.$transaction(async (tx) => {
        await tx.subject.findUniqueOrThrow({ where: { id: subjectId } });
        const overlap = await tx.schedule.findFirst({
            where: { isActive: true, OR: normalized.map(({ dayCode, time }) => ({ dayCode, time })) },
        });
        if (overlap) throw new Error("One of these day and time slots is already scheduled.");

        const created: ScheduleData[] = [];
        for (const data of normalized) created.push(await tx.schedule.create({ data }));
        return created;
    });
}

export async function updateSchedule(id: number, input: ScheduleInput): Promise<ScheduleData> {
    if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid schedule.");
    const data = normalizeScheduleInput(input);

    return prisma.$transaction(async (tx) => {
        await tx.schedule.findUniqueOrThrow({ where: { id } });
        const overlap = await tx.schedule.findFirst({
            where: {
                id: { not: id },
                isActive: true,
                dayCode: data.dayCode,
                time: data.time,
            },
        });
        if (overlap) throw new Error("This day and time slot is already scheduled.");
        return tx.schedule.update({ where: { id }, data });
    });
}

export async function deleteSchedule(id: number): Promise<ScheduleData> {
    if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid schedule.");
    return prisma.schedule.delete({ where: { id } });
}
