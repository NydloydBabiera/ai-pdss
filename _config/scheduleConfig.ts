import { DataTableColumn } from "@/_elements/dataTable";

export type ScheduleType = {
    subjectId: number;
    day: string;
    dayCode: string;
    time: Date;
}

export type ScheduleInput = {
    day: string;
    dayCode: string;
    time: string;
}

export type ScheduleData = {
    id: number;
    subjectId: number | null;
    day: string;
    dayCode: string;
    time: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
// export type ScheduleData = {
//     id: number;
//     subjectId: number | null;
//     subject: SubjectData | null;
//     day: string;
//     dayCode: string;
//     time: Date;
//     isActive: boolean;

// }

export type SubjectScheduleData = {
    id: number;
    title: string;
    description: string;
    code: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    schedule: ScheduleData[];
};

export const scheduleColumns: DataTableColumn<SubjectScheduleData>[] = [
    {
        key: "title",
        header: "Subject"
    },
    {
        key: "description",
        header: "Subject Code",
    },
    {
        key: "code",
        header: "Subject Code",
    },
    {
        key: "day",
        header: "Day Schedule",
    },
    {
        key: "dayCode",
        header: "Day",
    },
    {
        key: "time",
        header: "Time",
    },
    // {
    //     key: "isActive",
    //     header: "Active",
    //     render: (schedule) =>
    //         React.createElement(Checkbox, {
    //             checked: schedule.,
    //             disabled: true,
    //         }),
    // },
]
