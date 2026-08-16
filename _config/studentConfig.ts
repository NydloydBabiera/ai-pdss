import { DataTableColumn } from "@/_elements/dataTable";

export type User = {
  id: number;
  name: string;
  email: string;
  gradeLevel: string;
  section: string;
  status: "Active" | "Inactive";
};


export const studentColumns: DataTableColumn<User>[] = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "gradeLevel",
    header: "Grade Level",
  },
  {
    key: "section",
    header: "Section",
  },
];