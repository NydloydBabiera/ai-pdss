import { DynamicFieldConfig } from "@/_elements/cardForm";
import { DataTableColumn } from "@/_elements/dataTable";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { DialogField } from "./types";

export type SubjectData = {
    id: number;
    title: string;
    description: string;
    code: string;
    isActive: boolean;
}

export type SubjectType = {
    title: string;
    description: string;
    code: string;
}

export const subjectColumns: DataTableColumn<SubjectData>[] = [
    {
        key: "title",
        header: "Title"
    },
    {
        key: "description",
        header: "Description"
    },
    {
        key: "code",
        header: "Subject Code"
    },
    {
        key: "isActive",
        header: "Active",
        render: (subject) =>
            React.createElement(Checkbox, {
                checked: subject.isActive,
                disabled: true,
            }),
    },
]

export const subjectFields: DialogField[] = [
    {
        name: "title",
        label: "Subject Title",
        type: "text",
        placeholder: "",
    },
    {
        name: "description",
        label: "Descriptive Title",
        type: "text",
        placeholder: "",
    },
    {
        name: "code",
        label: "Code",
        type: "text",
        placeholder: "",
    },
]