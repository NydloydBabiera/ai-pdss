"use client";

import {
  AcademicLevelData,
  AcademicLevelType,
  levelsColumns,
  levelsFields,
} from "@/_config/levelsConfig";
import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { DataTableActions } from "@/_elements/dataTableActions";
import { FormDialog } from "@/_elements/dialog";
import { Filter } from "@/_elements/filter";
import { useLoading } from "@/_elements/loadingScreen";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";
import { useCallback, useEffect, useState } from "react";
import {
  createAcademicLevelAction,
  deleteAcademicLevelAction,
  fetchAcademicLevelsAction,
  updateAcademicLevelAction,
} from "./actions";

export default function LevelsPage() {
  const [levels, setLevels] = useState<AcademicLevelData[]>([]);
  const [selected, setSelected] = useState<AcademicLevelData>();
  const [formOpen, setFormOpen] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const load = useCallback(async () => {
    startLoading("Loading academic levels...");
    try {
      const result = await fetchAcademicLevelsAction();
      if (!result.success) return notify.error(String(result.message));
      setLevels(result.data ?? []);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const handleSubmit = async (values: Record<string, string | boolean>) => {
    startLoading(
      selected ? "Updating academic level..." : "Creating academic level...",
    );
    try {
      const data: AcademicLevelType = {
        department: String(values.department),
        level: String(values.level),
        class: String(values.class),
      };
      const result = selected
        ? await updateAcademicLevelAction(selected.id, data)
        : await createAcademicLevelAction(data);
      if (!result.success) return notify.error(String(result.message));
      notify.success(String(result.message));
      setFormOpen(false);
      setSelected(undefined);
      await load();
    } finally {
      stopLoading();
    }
  };

  const handleDelete = async (row: AcademicLevelData) => {
    if (
      !window.confirm(
        `Delete ${row.level} ${row.class} and its student assignments?`,
      )
    )
      return;
    startLoading("Deleting academic level...");
    try {
      const result = await deleteAcademicLevelAction(row.id);
      if (!result.success) return notify.error(result.message);
      setLevels((current) => current.filter((item) => item.id !== row.id));
      notify.success(result.message);
    } finally {
      stopLoading();
    }
  };

  const columns: DataTableColumn<AcademicLevelData>[] = [
    ...levelsColumns,
    {
      key: "actions",
      header: "Actions",
      className: "w-12 text-right",
      render: (row) => (
        <DataTableActions
          label={`${row.level} ${row.class}`}
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
    ? levelsFields.map((field) => ({
        ...field,
        defaultValue: String(
          selected[field.name as keyof AcademicLevelData] ?? "",
        ),
      }))
    : levelsFields;

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search level by" filterBy={levelsColumns} />
          <FormDialog
            key={selected?.id ?? "new"}
            open={formOpen}
            trigger={<Button>ADD ACADEMIC LEVEL</Button>}
            title={selected ? "Edit Academic Level" : "Add Academic Level"}
            description="Fill in the academic level details."
            fields={fields}
            submitText={selected ? "Save Changes" : "Submit"}
            onSubmit={handleSubmit}
            onOpenChange={(open) => {
              setFormOpen(open);
              if (!open) setSelected(undefined);
            }}
          />
        </div>
        <DataTable columns={columns} data={levels} rowKey="id" />
      </div>
    </div>
  );
}
