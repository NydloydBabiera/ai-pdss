"use client";

import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { Filter } from "@/_elements/filter";
import { FormDialog } from "@/_elements/dialog";
import { Button } from "@/components/ui/button";
import { studentColumns, User } from "@/_config/studentConfig";



const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    gradeLevel: "8",
    section: "St. Jude",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    gradeLevel: "9",
    section: "St. Jude",
    status: "Inactive",
  },
];


export default function StudentsPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search student by" filterBy={studentColumns} />
          <FormDialog
            trigger={<Button>Add Student</Button>}
            title="Add Student"
            description="Fill in the details to add a new student."
            fields={[
              {
                name: "name",
                label: "Name",
                type: "text",
                placeholder: "Enter student name",
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
            ]}
            onSubmit={(values) => {
              // Handle form submission
            }}
          />
        </div>
        <DataTable columns={studentColumns} data={users} rowKey="id" />
      </div>
    </div>
  );
}
