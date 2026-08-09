"use client";

import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { Filter } from "@/_elements/filter";

type User = {
  id: string;
  name: string;
  email: string;
  gradeLevel: string;
  section: string;
  status: "Active" | "Inactive";
};

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    gradeLevel: "8",
    section: "St. Jude",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    gradeLevel: "9",
    section: "St. Jude",
    status: "Inactive",
  },
];

const columns: DataTableColumn<User>[] = [
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

export default function StudentsPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 ">
        <Filter filterBy={columns} />
        <DataTable columns={columns} data={users} rowKey="id" />
      </div>
    </div>
  );
}
