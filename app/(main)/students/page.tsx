"use client";

import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { Filter } from "@/_elements/filter";
import { FormDialog } from "@/_elements/dialog";
import { Button } from "@/components/ui/button";
import { studentColumns, StudentDataType } from "@/_config/studentConfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLoading } from "@/_elements/loadingScreen";
import { fetchStudentsAction } from "./registration/action";
import { notify } from "@/lib/notifications";

// const users: User[] = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john@example.com",
//     gradeLevel: "8",
//     section: "St. Jude",
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "jane@example.com",
//     gradeLevel: "9",
//     section: "St. Jude",
//     status: "Inactive",
//   },
// ];

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentDataType[]>();
  const { startLoading, stopLoading } = useLoading();

  const fetchStudents = async () => {
    try {
      startLoading("Loading documents...");

      const result = await fetchStudentsAction();

      if (!result.success) {
        notify.error(result.message as any);
        console.error(result.message);
        return;
      }
      setStudents(result.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search student by" filterBy={studentColumns} />
          <Button
            onClick={() => {
              router.push("/students/registration");
            }}
          >
            Add Student
          </Button>
        </div>
        <DataTable columns={studentColumns} data={students ?? []} rowKey="id" />
      </div>
    </div>
  );
}
