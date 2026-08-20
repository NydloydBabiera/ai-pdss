import { DataTableColumn } from "@/_elements/dataTable";
import { format } from "date-fns";
import { DialogField } from "./types";

export type AcademicYearType = {
    start: Date;
    end: Date;
}

export type AcademicYearData = {
    id: number;
    start: Date;
    end: Date;
    isCurrent: boolean;
}

export const academicYearColumns: DataTableColumn<AcademicYearData>[] = [
    {
        key: "start",
        header: "Academic Year Start",
        render: (academicYear) =>
            academicYear.start
                ? format(academicYear.start, "MMMM yyyy")
                : "-",
    },
    {
        key: "end",
        header: "Academic Year End",
        render: (academicYear) =>
            academicYear.end
                ? format(academicYear.end, "MMMM yyyy")
                : "-",
    },
]

interface FieldConfig {
    name: string;
    label: string;
    type: "text" | "email" | "number" | "date" | "select" | "radio";
    placeholder: string;
    required: boolean;
    options?: { label: string; value: string }[];
}

export const academicYearFields: DialogField[] = [
    {
        name: "start",
        label: "Academic Year Start",
        type: "month",
        placeholder: "Setup start of academic year",
        required: true,
    },
    {
        name: "end",
        label: "Academic Year End",
        type: "month",
        placeholder: "Setup end of academic year",
        required: true,
    },
]