import { DataTableColumn } from "@/_elements/dataTable";
import { DialogField } from "./types";
import { Gender } from "@/generated/prisma/enums";
import { DynamicFieldConfig } from "@/_elements/cardForm";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export type InstructorData = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  age: number;
  birthDate: Date;
  gender: Gender;
  address: string;
  isActive: boolean;
};

export type InstructorType = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  age: number;
  birthDate: Date;
  gender: Gender;
  address: string;
};

type InstructorColumnActions = {
  onEdit: (instructor: InstructorData) => void;
  onDelete: (instructor: InstructorData) => void;
};


export const instructorColumns: DataTableColumn<InstructorData>[] = [
  {
    key: "firstName",
    header: "First Name",
  },
  {
    key: "middleName",
    header: "Middle Name",
  },
  {
    key: "lastName",
    header: "Last Name",
  },
  {
    key: "age",
    header: "Age",
  },
  {
    key: "address",
    header: "Address",
  },
  {
    key: "birthDate",
    header: "Date of Birth",
  },
  {
    key: "isActive",
    header: "Active",
    render: (instructor) =>
      React.createElement(Checkbox, {
        checked: instructor.isActive,
        disabled: true,
      }),
  },
];

export const instructorFields: Array<DynamicFieldConfig> = [
  {
    name: "firstName",
    label: "First name",
    type: "text",
    placeholder: "",
  },
  {
    name: "middleName",
    label: "Middle name",
    type: "text",
    placeholder: "",
  },
  {
    name: "lastName",
    label: "Last name",
    type: "text",
    placeholder: "",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter age",
  },
  {
    name: "birthDate",
    label: "Date of Birth",
    type: "date",
    placeholder: "",
  },
  {
    name: "gender",
    label: "Gender",
    type: "radio",
    placeholder: "Choose gender",
    options: [
      { label: "Male", value: "MALE" },
      { label: "Female", value: "FEMALE" },
    ],
    required: true,
  },
  {
    name: "address1",
    label: "Address Line 1",
    type: "text",
    placeholder: "Enter address",
    required: true,
  },
  {
    name: "address2",
    label: "Address Line 2",
    type: "text",
    placeholder: "Enter address",
    required: true,
  },
];
