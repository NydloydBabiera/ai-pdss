"use client";

import {
  subjectColumns,
  SubjectData,
  subjectFields,
  SubjectType,
} from "@/_config/subjectConfig";
import { DataTable, DataTableColumn } from "@/_elements/dataTable";
import { FormDialog } from "@/_elements/dialog";
import { Filter } from "@/_elements/filter";
import { useLoading } from "@/_elements/loadingScreen";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createSubjectAction, fetchSubjectsAction } from "./action";
import { notify } from "@/lib/notifications";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>();
  const [formOpen, setFormOpen] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const fetchSubjects = async () => {
    try {
      startLoading("Fetching subjects...");

      const result = await fetchSubjectsAction();

      if (!result.success) {
        notify.error(result.message as any);
        console.error(result.message);
        return;
      }

      setSubjects(result.data);
    } catch (error) {
      console.error(error);
      notify.error(error as any);
    } finally {
      stopLoading();
    }
  };

  const handleSubmit = async (values: Record<string, string | boolean>) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);

    startLoading("Saving subject...");

    try {
      const subject: SubjectType = {
        title: String(values.title),
        description: String(values.description),
        code: String(values.code),
      };

      const result = await createSubjectAction(subject);

      console.log("🚀 ~ handleSubmit ~ result:", result);

      if (!result.success) {
        notify.error(result.message as any);
        console.error(result.message);
        return;
      }

      setFormOpen(false);
      fetchSubjects();
      console.log("Academic level created:", result.data);
    } catch (error) {
      console.error(error);
      notify.error(error as any);
    } finally {
      stopLoading();
    }
  };

  useEffect(() =>{
    fetchSubjects()
  },[])

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-2">
          <Filter placeholder="Search subject by" filterBy={subjectColumns} />
          <FormDialog
            open={formOpen}
            trigger={<Button>ADD SUBJECT</Button>}
            title="Add new subject"
            description="Fill in the details to add a new academic level."
            fields={subjectFields}
            onSubmit={(values) => {
              console.log("🚀 ~ LevelsPage ~ values:", values);
              handleSubmit(values);
            }}
            onOpenChange={setFormOpen}
          />
        </div>
        {/* <div className="flex items-center gap-2">
          <Filter placeholder="Search subject by" filterBy={subjectColumns} />
          <Button>Add Subject</Button>
        </div> */}
        <DataTable columns={subjectColumns} data={subjects ?? []} rowKey="id" />
      </div>
    </div>
  );
}
