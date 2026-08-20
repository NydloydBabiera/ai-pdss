"use client";

import {
  academicYearColumns,
  AcademicYearData,
  academicYearFields,
  AcademicYearType,
} from "@/_config/academicYearConfig";
import { DataTable } from "@/_elements/dataTable";
import { FormDialog } from "@/_elements/dialog";
import { Filter } from "@/_elements/filter";
import { useLoading } from "@/_elements/loadingScreen";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createAcademicYearAction, fetchAcademicYearAction } from "./actions";
import { notify } from "@/lib/notifications";
import { fetchStudents } from "@/services/student.service";

export default function AcademicYearPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYearData[]>();
  const [formOpen, setFormOpen] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const fetchAcademicYears = async () => {
    try {
      startLoading("Fetching academic years...");

      const result = await fetchAcademicYearAction();

      if (!result.success) {
        notify.error(result.message);
        console.error(result.message);
        return;
      }

      setAcademicYears(result.data);
    } catch (error) {
      console.error(error);
      notify.error(error as any);
    } finally {
      stopLoading();
    }
  };

  const handleSubmit = async (values: Record<string, string | boolean>) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);

    startLoading("Creating academic level...");

    try {
      const academicYear: AcademicYearType = {
        start: new Date(values.start as string),
        end: new Date(values.end as string),
      };

      const result = await createAcademicYearAction(academicYear);

      console.log("🚀 ~ handleSubmit ~ result:", result);

      if (!result.success) {
        notify.error(result.message as any);
        console.error(result.message);
        return;
      }

      setFormOpen(false);
      fetchAcademicYears();
      console.log("Academic level created:", result.data);
    } catch (error) {
      console.error(error);
      notify.error(error as any);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Filter
            placeholder="Search level by"
            filterBy={academicYearColumns}
          />
          <FormDialog
            open={formOpen}
            trigger={<Button>START NEW ACADEMIC YEAR</Button>}
            title="Add Academic Level"
            description="Fill in the details to add a new academic level."
            fields={academicYearFields}
            onSubmit={(values) => {
              console.log("🚀 ~ LevelsPage ~ values:", values);
              handleSubmit(values);
            }}
            onOpenChange={setFormOpen}
          />
        </div>
        <DataTable
          columns={academicYearColumns}
          data={academicYears ?? []}
          rowKey="id"
        />
      </div>
    </div>
  );
}
