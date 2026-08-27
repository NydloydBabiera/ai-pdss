"use client";
import {
  instructorColumns,
  InstructorData,
  InstructorType,
} from "@/_config/instructorConfig";
import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { Filter } from "@/_elements/filter";
import { useLoading } from "@/_elements/loadingScreen";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteInstructorAction,
  fetchInstructorsActions,
} from "./registration/actions";
import { notify } from "@/lib/notifications";
import { DataTableActions } from "@/_elements/dataTableActions";

export default function InstructorsPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<InstructorData[]>();
  const { startLoading, stopLoading } = useLoading();

  // const fetchInstructorList = useCallback(async () => {
  //   try {
  //     startLoading("Loading documents...");

  //     const result = await fetchInstructorsActions();

  //     if (!result.success) {
  //       notify.error(String(result.message));
  //       console.error(result.message);
  //       return;
  //     }
  //     setInstructors(result.data);
  //   } catch (error) {
  //     notify.error(
  //       error instanceof Error ? error.message : "Unable to load instructors.",
  //     );
  //     console.error("Failed to fetch instructors:", error);
  //   } finally {
  //     stopLoading();
  //   }
  // }, [startLoading, stopLoading]);

  const load = useCallback(async () => {
    startLoading("Loading students...");
    try {
      const result = await fetchInstructorsActions();
      if (!result.success) return notify.error(String(result.message));
      setInstructors(result.data ?? []);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  const handleDelete = useCallback(
    async (instructor: InstructorData) => {
      const confirmed = window.confirm(
        `Delete ${instructor.firstName} ${instructor.lastName}? This action cannot be undone.`,
      );

      if (!confirmed) return;

      startLoading("Deleting instructor...");
      try {
        const result = await deleteInstructorAction(instructor.id);

        if (!result.success) {
          notify.error(result.message);
          return;
        }

        setInstructors((current) =>
          current?.filter((item) => item.id !== instructor.id),
        );
        notify.success(result.message);
      } catch (error) {
        console.error("Failed to delete instructor:", error);
        notify.error(
          error instanceof Error
            ? error.message
            : "Unable to delete instructor.",
        );
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const columns: DataTableColumn<InstructorData>[] = [
    ...instructorColumns,
    {
      key: "actions",
      header: "Actions",
      className: "w-12 text-right",
      render: (row) => (
        <DataTableActions
          label={`${row.firstName} ${row.lastName}`}
          onEdit={() => router.push(`/instructors/${row.id}/edit`)}
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
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search student by" filterBy={columns} />
          <Button
            onClick={() => {
              router.push("/instructors/registration");
            }}
          >
            Add Instructor
          </Button>
        </div>
        <DataTable columns={columns} data={instructors ?? []} rowKey="id" />
      </div>
    </div>
  );
}
