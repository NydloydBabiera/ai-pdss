import { AcademicYearData, AcademicYearType } from "@/_config/academicYearConfig";
import { AcademicLevelData, AcademicLevelType } from "@/_config/levelsConfig";
import { prisma } from "@/lib/prisma";




export async function createAcademicYear(academicYear: AcademicYearType): Promise<AcademicYearType> {
    console.log("🚀 ~ createAcademicYear ~ academicYear:", academicYear)
    const setup = await prisma.academicYear.create({
        data: {
            ...academicYear,
            isCurrent: true
        }
    })
    return setup;
}

export async function fetchAcademicYear(): Promise<AcademicYearData[]> {
    const data = await prisma.academicYear.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })

    return data
}

export async function updateAcademicYear(id: number, academicYear: AcademicYearType): Promise<AcademicYearData> {
    const data = await prisma.academicYear.update({
        where: {
            id: id,
        },
        data: academicYear
    })

    return data;
}

export async function deleteAcademicYear(id: number): Promise<AcademicYearData> {
    return prisma.$transaction(async (tx) => {
        await tx.studentLevel.deleteMany({ where: { academicYearId: id } })
        return tx.academicYear.delete({ where: { id } })
    })
}



export async function createAcademicLevel(academicLevel: AcademicLevelType): Promise<AcademicLevelData> {
    const setup = await prisma.academicLevel.create({
        data: academicLevel
    })
    return setup;
}

export async function fetchAcademicLevels(): Promise<AcademicLevelData[]> {
    const data = await prisma.academicLevel.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })
    return data
}

export async function updateAcademicLevel(id: number, academicLevel: AcademicLevelType): Promise<AcademicLevelData> {
    const data = await prisma.academicLevel.update({
        where: {
            id: id,
        },
        data: academicLevel
    })

    return data;
}

export async function deleteAcademicLevel(id: number): Promise<AcademicLevelData> {
    return prisma.$transaction(async (tx) => {
        await tx.studentLevel.deleteMany({ where: { academicLevelId: id } })
        return tx.academicLevel.delete({ where: { id } })
    })
}
