import { DataTableColumn } from "@/_elements/dataTable";
import { DialogField } from "./types";

export type Levels = {
  id: number;
  stage: string;
  level: string;
  class: string;
};

export const levelsFields: DialogField[] = [
  {
    name: "stage",
    label: "Stage",
    type: "text",
    placeholder: "Enter academic stage",
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

export const levelsColumns: DataTableColumn<Levels>[] = [
  {
    key: "stage",
    header: "Department",
  },
  {
    key: "level",
    header: "Grade/Year Level",
  },
  {
    key: "class",
    header: "Section/Class",
  },
];


