"use client";

import { studentColumns, StudentDataType } from "@/_config/studentConfig";
import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { DataTableActions } from "@/_elements/dataTableActions";
import { Filter } from "@/_elements/filter";
import { useLoading } from "@/_elements/loadingScreen";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  deleteStudentAction,
  fetchStudentsAction,
} from "./registration/action";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentDataType[]>([]);
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const load = useCallback(async () => {
    startLoading("Loading students...");
    try {
      const result = await fetchStudentsAction();
      if (!result.success) return notify.error(String(result.message));
      setStudents(result.data ?? []);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const handleDelete = async (student: StudentDataType) => {
    if (
      !window.confirm(
        `Delete ${student.firstName} ${student.lastName} and their level assignments?`,
      )
    )
      return;
    startLoading("Deleting student...");
    try {
      const result = await deleteStudentAction(student.id);
      if (!result.success) return notify.error(result.message);
      setStudents((current) =>
        current.filter((item) => item.id !== student.id),
      );
      notify.success(result.message);
    } finally {
      stopLoading();
    }
  };
  const columns: DataTableColumn<StudentDataType>[] = [
    ...studentColumns,

    {
      key: "actions",
      header: "Actions",
      className: "w-12 text-right",
      render: (row) => (
        <DataTableActions
          label={`${row.firstName} ${row.lastName}`}
          onEdit={() => router.push(`/students/${row.id}/edit`)}
          onDelete={() => void handleDelete(row)}
        />
      ),
    },
  ];

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search student by" filterBy={studentColumns} />
          <Button onClick={() => router.push("/students/registration")}>
            Add Student
          </Button>
        </div>
        <DataTable columns={columns} data={students} rowKey="id" />
      </div>
    </div>
  );
}
