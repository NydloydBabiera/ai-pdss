import { DataTableColumn } from "@/_elements/dataTable";
import { DialogField } from "./types";

export type Instructor = {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  birthDate: string;
  isActive: boolean;
}

export const instructorColumns: DataTableColumn<Instructor>[] = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "gender",
    header: "Grade Level",
  },
  {
    key: "isActive",
    header: "Active",
  },
];

export const instructorFields: DialogField[] = [
  {
    name: "firstName",
    label: "First name",
    type: "text",
    placeholder: "",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter student email",
  },
  {
    name: "gradeLevel",
    label: "Grade Level",
    type: "text",
    placeholder: "Enter grade level",
  },
  {
    name: "section",
    label: "Section",
    type: "text",
    placeholder: "Enter section",
  },
]