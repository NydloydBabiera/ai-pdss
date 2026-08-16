import { prisma } from "@/lib/prisma";

type AcademicYearType = {
    monthStart: Date;
    yearStart: Date;
    monthEnd: Date;
    yearEnd: Date;
    isCurrent: boolean;
}



export async function createAcademicYear(academicYear: AcademicYearType): Promise<AcademicYearType> {
    const setup = await prisma.academicYear.create({
        data: academicYear
    })
    return setup;
}

export async function fetchAcademicYear(): Promise<AcademicYearType[]> {
    const data = await prisma.academicYear.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })

    return data
}

export async function updateAcademicYear(id: number, academicYear: AcademicYearType): Promise<AcademicYearType> {
    const data = await prisma.academicYear.update({
        where: {
            id: id,
        },
        data: academicYear
    })

    return data;
}

export async function deleteAcademicYear(id: number): Promise<Boolean> {
    const data = await prisma.academicYear.delete({
        where: {
            id: id
        }
    })

    return true;
}

type AcademicLevelType = {
    department: string;
    level: string;
    class: string;
}

export async function createAcademicLevelType(academicLevel: AcademicLevelType): Promise<AcademicLevelType> {
    const setup = await prisma.academicLevel.create({
        data: academicLevel
    })
    return setup;
}

export async function fetchAcademicLevels(): Promise<AcademicLevelType[]> {
    const data = await prisma.academicLevel.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })
    return data
}

export async function updateAcademicLevel(id: number, academicYear: AcademicYearType): Promise<AcademicLevelType> {
    const data = await prisma.academicLevel.update({
        where: {
            id: id,
        },
        data: academicYear
    })

    return data;
}

export async function deleteAcademicLevel(id: number): Promise<Boolean> {
    const data = await prisma.academicLevel.delete({
        where: {
            id: id
        }
    })

    return true;
}