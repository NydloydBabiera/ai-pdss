import { DataTableColumn } from "@/_elements/dataTable";
import { DialogField } from "./types";

// export type Levels = {
//   id: number;
//   stage: string;
//   level: string;
//   class: string;
// };

export type AcademicLevelType = {
  department: string;
  level: string;
  class: string;
}

export type AcademicLevelData = {
  id: number;
  department: string;
  level: string;
  class: string;
}

export const levelsFields: DialogField[] = [
  {
    name: "department",
    label: "Department",
    type: "dropdown",
    placeholder: "Select department",
    required: true,
    options: [
      {
        label: "College",
        value: "COLLEGE",
      },
      {
        label: "Junior High School",
        value: "JHS",
      },
      {
        label: "Senior High School",
        value: "SHS",
      },
    ],
  },
  {
    name: "level",
    label: "Level",
    type: "text",
    placeholder: "Enter level",
  },
  {
    name: "class",
    label: "Class",
    type: "text",
    placeholder: "Enter class or section or block",
  },
];

export const levelsColumns: DataTableColumn<AcademicLevelData>[] = [
  {
    key: "department",
    header: "Department",
    className: "text-center",
  },
  {
    key: "level",
    header: "Grade/Year Level",
    className: "text-center",
  },
  {
    key: "class",
    header: "Section/Class",
    className: "text-center",
  },
];


