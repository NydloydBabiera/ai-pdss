"use client"
import {
  Instructor,
  instructorColumns,
  instructorFields,
} from "@/_config/instructorConfig";
import { DataTable } from "@/_elements/dataTable";
import { FormDialog } from "@/_elements/dialog";
import { Filter } from "@/_elements/filter";
import { Button } from "@/components/ui/button";

const instructors: Instructor[] = [
  {
    id: 1,
    name: "Instructor 1",
    email: "test@gmail.com",
    age: 28,
    gender: "Male",
    birthDate: "1995-01-01",
    isActive: true,
  },
  {
    id: 2,
    name: "Instructor 2",
    email: "test@gmail.com",
    age: 28,
    gender: "Male",
    birthDate: "1995-01-01",
    isActive: true,
  },
];

export default function InstructorsPage() {

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Filter
            placeholder="Search instructor by"
            filterBy={instructorColumns}
          />
          <FormDialog
            trigger={<Button>Add Instructor</Button>}
            title="Add Instructor"
            description="Fill in the details to add a new instructor."
            fields={instructorFields}
            onSubmit={(values) => {
              console.log("🚀 ~ InstructorsPage ~ values:", values);
              // Handle form submission
            }}
          />
        </div>
        <DataTable columns={instructorColumns} data={instructors} rowKey="id" />
      </div>
    </div>
  );
}
