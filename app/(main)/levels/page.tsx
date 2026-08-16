"use client";
import { Levels, levelsColumns, levelsFields } from "@/_config/levelsConfig";
import { DialogField, Fields } from "@/_config/types";
import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { FormDialog } from "@/_elements/dialog";
import { Filter } from "@/_elements/filter";
import { Button } from "@/components/ui/button";

const levels: Levels[] = [
  {
    id: 1,
    stage: "Junior High School",
    level: "Grade 7",
    class: "St. Jude",
  },
  {
    id: 2,
    stage: "Junior High School",
    level: "Grade 8",
    class: "St. Francis",
  },
];

export default function LevelsPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search level by" filterBy={levelsColumns} />
          <FormDialog
            trigger={<Button>ADD ACADEMIC LEVELS</Button>}
            title="Add Academic Level"
            description="Fill in the details to add a new academic level."
            fields={levelsFields}
            onSubmit={(values) => {
              console.log("🚀 ~ LevelsPage ~ values:", values);
              // Handle form submission
            }}
          />
        </div>
        <DataTable columns={levelsColumns} data={levels} rowKey="id" />
      </div>
    </div>
  );
}
