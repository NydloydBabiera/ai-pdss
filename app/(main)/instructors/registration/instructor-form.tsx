"use client";

import { instructorFields, InstructorData, InstructorType } from "@/_config/instructorConfig";
import DynamicCardForm, { DynamicFieldConfig } from "@/_elements/cardForm";
import { useLoading } from "@/_elements/loadingScreen";
import { Gender } from "@/generated/prisma/enums";
import { notify } from "@/lib/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createInstructorAction, fetchInstructorAction, updateInstructorAction } from "./actions";

type InstructorFormProps = { instructorId?: number };

function fieldsWithInstructor(instructor: InstructorData): DynamicFieldConfig[] {
  const [address1, ...remainingAddress] = instructor.address.split(",");
  const defaultValues: Record<string, string> = {
    firstName: instructor.firstName,
    middleName: instructor.middleName,
    lastName: instructor.lastName,
    email: instructor.email,
    age: String(instructor.age),
    birthDate: new Date(instructor.birthDate).toISOString().slice(0, 10),
    gender: instructor.gender,
    address1: address1.trim(),
    address2: remainingAddress.join(",").trim(),
  };

  return instructorFields.map((field) => ({
    ...field,
    defaultValue: defaultValues[field.name] ?? "",
  }));
}

export default function InstructorForm({ instructorId }: InstructorFormProps) {
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const [instructor, setInstructor] = useState<InstructorData>();
  const [isFetching, setIsFetching] = useState(Boolean(instructorId));
  const isEditing = instructorId !== undefined;

  useEffect(() => {
    if (!instructorId) return;

    const loadInstructor = async () => {
      setIsFetching(true);
      startLoading("Loading instructor...");
      try {
        const result = await fetchInstructorAction(instructorId);
        if (!result.success) {
          notify.error(result.message);
          router.replace("/instructors");
          return;
        }
        setInstructor(result.data);
      } finally {
        setIsFetching(false);
        stopLoading();
      }
    };

    void loadInstructor();
  }, [instructorId, router]);

  const fields = useMemo(
    () => (instructor ? fieldsWithInstructor(instructor) : instructorFields),
    [instructor],
  );

  const handleSubmit = async (values: Record<string, string>) => {
    startLoading(isEditing ? "Updating instructor..." : "Creating instructor...");
    try {
      const instructorData: InstructorType = {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        email: values.email,
        age: Number(values.age),
        address: [values.address1, values.address2].filter(Boolean).join(", "),
        birthDate: new Date(values.birthDate),
        gender: values.gender as Gender,
      };

      const result = isEditing
        ? await updateInstructorAction(instructorId, instructorData)
        : await createInstructorAction(instructorData);

      if (!result.success) {
        notify.error(String(result.message));
        return;
      }

      notify.success(String(result.message));
      router.push("/instructors");
    } catch (error) {
      console.error(error);
      notify.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      stopLoading();
    }
  };

  if (isFetching || (isEditing && !instructor)) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 animate-float-up">
      <div className="flex w-full max-w-md flex-col">
        <DynamicCardForm
          key={instructor?.id ?? "new-instructor"}
          title={isEditing ? "Edit Instructor" : "Instructor Registration"}
          description={isEditing ? "Update the instructor's personal information." : "Fill instructor's personal information."}
          fields={fields}
          submitLabel={isEditing ? "Save Changes" : "Submit"}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
