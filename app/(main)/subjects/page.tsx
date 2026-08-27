"use client";

import {
  subjectColumns,
  SubjectData,
  subjectFields,
  SubjectType,
} from "@/_config/subjectConfig";
import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { DataTableActions } from "@/_elements/dataTableActions";
import { FormDialog } from "@/_elements/dialog";
import { Filter } from "@/_elements/filter";
import { useLoading } from "@/_elements/loadingScreen";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";
import { useCallback, useEffect, useState } from "react";
import {
  createSubjectAction,
  deleteSubjectAction,
  fetchSubjectsAction,
  updateSubjectAction,
} from "./action";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [selected, setSelected] = useState<SubjectData>();
  const [formOpen, setFormOpen] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const load = useCallback(async () => {
    startLoading("Fetching subjects...");
    try {
      const result = await fetchSubjectsAction();
      if (!result.success) return notify.error(String(result.message));
      setSubjects(result.data ?? []);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  const handleSubmit = async (values: Record<string, string | boolean>) => {
    startLoading(selected ? "Updating subject..." : "Creating subject...");
    try {
      const data: SubjectType = {
        title: String(values.title),
        description: String(values.description),
        code: String(values.code),
      };
      const result = selected
        ? await updateSubjectAction(selected.id, data)
        : await createSubjectAction(data);
      if (!result.success) return notify.error(String(result.message));
      notify.success(String(result.message));
      setFormOpen(false);
      setSelected(undefined);
      await load();
    } finally {
      stopLoading();
    }
  };
  const handleDelete = async (row: SubjectData) => {
    if (
      !window.confirm(
        `Delete ${row.title}? Existing schedules will be unassigned.`,
      )
    )
      return;
    startLoading("Deleting subject...");
    try {
      const result = await deleteSubjectAction(row.id);
      if (!result.success) return notify.error(result.message);
      setSubjects((current) => current.filter((item) => item.id !== row.id));
      notify.success(result.message);
    } finally {
      stopLoading();
    }
  };
  const columns: DataTableColumn<SubjectData>[] = [
    ...subjectColumns,
    {
      key: "actions",
      header: "Actions",
      className: "w-12 text-right",
      render: (row) => (
        <DataTableActions
          label={row.title}
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
    ? subjectFields.map((field) => ({
        ...field,
        defaultValue: String(selected[field.name as keyof SubjectData] ?? ""),
      }))
    : subjectFields;

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search subject by" filterBy={subjectColumns} />
          <FormDialog
            key={selected?.id ?? "new"}
            open={formOpen}
            trigger={<Button>ADD SUBJECT</Button>}
            title={selected ? "Edit Subject" : "Add Subject"}
            description="Fill in the subject details."
            fields={fields}
            submitText={selected ? "Save Changes" : "Submit"}
            onSubmit={handleSubmit}
            onOpenChange={(open) => {
              setFormOpen(open);
              if (!open) setSelected(undefined);
            }}
          />
        </div>
        <DataTable columns={columns} data={subjects} rowKey="id" />
      </div>
    </div>
  );
}
