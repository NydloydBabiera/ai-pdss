import { DataTableColumn } from "@/_elements/dataTable";
import { Gender } from "@/generated/prisma/enums";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export type StudentFieldType = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  age: number;
  birthDate: Date;
  gender: Gender;
  address: string;
}

export type StudentDataType = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  age: number;
  birthDate: Date;
  gender: Gender;
  address: string;
  idCode: string;
  isActive: boolean;
}

export const studentColumns: DataTableColumn<StudentDataType>[] = [
  {
    key: "firstName",
    header: "First name",
  },
  {
    key: "middleName",
    header: "Middle name",
  },
  {
    key: "lastName",
    header: "Last Name",
  },
  {
    key: "idCode",
    header: "Student ID",
  },
  {
    key: "birthDate",
    header: "Birth Date",
    render: (student) =>
      student.birthDate
        ? format(student.birthDate, "MMM dd, yyy")
        : "-",
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
    key: "isActive",
    header: "Active",
    render: (student) =>
      React.createElement(Checkbox, {
        checked: student.isActive,
        disabled: true,
      })

  },

];


interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "select" | "radio";
  placeholder: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

export const studentFields: Array<FieldConfig> = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter  first name",
    required: true,
  },
  {
    name: "middleName",
    label: "Middle Name",
    type: "text",
    placeholder: "Enter  middle name",
    required: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter  last name",
    required: true,
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
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter age",
    required: true,
  },
  {
    name: "birthDate",
    label: "Birth Date",
    type: "date",
    placeholder: "Enter birth date",
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
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
  },
];