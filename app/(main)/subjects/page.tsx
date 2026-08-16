"use client";

import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { Filter } from "@/_elements/filter";
import { Button } from "@/components/ui/button";

type Subject = {
  id: number;
  name: string;
  code: string;
  description: string;
  stage: string;
  level: string;
  isActive: boolean;
};

const Subjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH101",
    description: "Basic Mathematics",
    stage: "Junior High School",
    level: "Grade 7",
    isActive: true,
  },
  {
    id: 2,
    name: "Science",
    code: "SCI101",
    description: "Basic Science",
    stage: "Junior High School",
    level: "Grade 7",
    isActive: true,
  },
  {
    id: 3,
    name: "Filipino",
    code: "FIL101",
    description: "Basic Filipino",
    stage: "Junior High School",
    level: "Grade 7",
    isActive: true,
  },
];

const columns: DataTableColumn<Subject>[] = [
  {
    key: "name",
    header: "Subject Name",
  },
  {
    key: "code",
    header: "Subject Code",
  },
  {
    key: "description",
    header: "Description",
  },
  {
    key: "stage",
    header: "Academic Stage",
  },
  {
    key: "level",
    header: "Grade/Year Level",
  },
  {
    key: "isActive",
    header: "Status",
  },
];

export default function SubjectsPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search subject by" filterBy={columns} />
          <Button>Add Subject</Button>
        </div>
        <DataTable columns={columns} data={Subjects} rowKey="id" />
      </div>
    </div>
  );
}
