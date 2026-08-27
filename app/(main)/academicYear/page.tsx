"use client";

import {
  academicYearColumns,
  AcademicYearData,
  academicYearFields,
  AcademicYearType,
} from "@/_config/academicYearConfig";
import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { DataTableActions } from "@/_elements/dataTableActions";
import { FormDialog } from "@/_elements/dialog";
import { Filter } from "@/_elements/filter";
import { useLoading } from "@/_elements/loadingScreen";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";
import { useCallback, useEffect, useState } from "react";
import {
  createAcademicYearAction,
  deleteAcademicYearAction,
  fetchAcademicYearAction,
  updateAcademicYearAction,
} from "./actions";

const monthValue = (date: Date) => new Date(date).toISOString().slice(0, 7);

export default function AcademicYearPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);
  const [selected, setSelected] = useState<AcademicYearData>();
  const [formOpen, setFormOpen] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const load = useCallback(async () => {
    startLoading("Fetching academic years...");
    try {
      const result = await fetchAcademicYearAction();
      if (!result.success) return notify.error(String(result.message));
      setAcademicYears(result.data ?? []);
    } finally {
      stopLoading();
    }
  }, []);

  const handleSubmit = async (values: Record<string, string | boolean>) => {
    startLoading(
      selected ? "Updating academic year..." : "Creating academic year...",
    );
    try {
      const data: AcademicYearType = {
        start: new Date(String(values.start)),
        end: new Date(String(values.end)),
      };
      const result = selected
        ? await updateAcademicYearAction(selected.id, data)
        : await createAcademicYearAction(data);
      if (!result.success) return notify.error(String(result.message));
      notify.success(String(result.message));
      setFormOpen(false);
      setSelected(undefined);
      await load();
    } finally {
      stopLoading();
    }
  };

  const handleDelete = async (row: AcademicYearData) => {
    if (
      !window.confirm(
        "Delete this academic year and its student level assignments?",
      )
    )
      return;
    startLoading("Deleting academic year...");
    try {
      const result = await deleteAcademicYearAction(row.id);
      if (!result.success) return notify.error(result.message);
      setAcademicYears((current) =>
        current.filter((item) => item.id !== row.id),
      );
      notify.success(result.message);
    } finally {
      stopLoading();
    }
  };

  const columns: DataTableColumn<AcademicYearData>[] = [
    ...academicYearColumns,
    {
      key: "actions",
      header: "Actions",
      className: "w-12 text-right",
      render: (row) => (
        <DataTableActions
          label={`${monthValue(row.start)} - ${monthValue(row.end)}`}
          onEdit={() => {
            setSelected(row);
            setFormOpen(true);
          }}
          onDelete={() => void handleDelete(row)}
        />
      ),
    },
  ];

  const fields = selected
    ? academicYearFields.map((field) => ({
        ...field,
        defaultValue:
          field.name === "start"
            ? monthValue(selected.start)
            : monthValue(selected.end),
      }))
    : academicYearFields;

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Filter
            placeholder="Search academic year by"
            filterBy={academicYearColumns}
          />
          <FormDialog
            key={selected?.id ?? "new"}
            open={formOpen}
            trigger={<Button>START NEW ACADEMIC YEAR</Button>}
            title={selected ? "Edit Academic Year" : "Add Academic Year"}
            description="Fill in the academic year dates."
            fields={fields}
            submitText={selected ? "Save Changes" : "Submit"}
            onSubmit={handleSubmit}
            onOpenChange={(open) => {
              setFormOpen(open);
              if (!open) setSelected(undefined);
            }}
          />
        </div>
        <DataTable columns={columns} data={academicYears} rowKey="id" />
      </div>
    </div>
  );
}
