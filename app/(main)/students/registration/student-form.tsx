"use client";

import {
  studentFields,
  StudentDataType,
  StudentFieldType,
} from "@/_config/studentConfig";
import DynamicCardForm, { DynamicFieldConfig } from "@/_elements/cardForm";
import { useLoading } from "@/_elements/loadingScreen";
import { Gender } from "@/generated/prisma/enums";
import { notify } from "@/lib/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createStudentAction,
  fetchStudentAction,
  updateStudentAction,
} from "./action";

type StudentFormProps = { studentId?: number };

function fieldsWithStudent(student: StudentDataType): DynamicFieldConfig[] {
  const [address1, ...remainingAddress] = student.address.split(",");
  const values: Record<string, string> = {
    firstName: student.firstName,
    middleName: student.middleName,
    lastName: student.lastName,
    email: student.email,
    age: String(student.age),
    gender: student.gender,
    birthDate: new Date(student.birthDate).toISOString().slice(0, 10),
    address1: address1.trim(),
    address2: remainingAddress.join(",").trim(),
  };
  return studentFields.map((field) => ({
    ...field,
    defaultValue: values[field.name] ?? "",
  }));
}

export default function StudentForm({ studentId }: StudentFormProps) {
  const [student, setStudent] = useState<StudentDataType>();
  const [isFetching, setIsFetching] = useState(Boolean(studentId));
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const isEditing = studentId !== undefined;

  useEffect(() => {
    if (!studentId) return;
    const load = async () => {
      setIsFetching(true);
      startLoading("Loading student...");
      try {
        const result = await fetchStudentAction(studentId);
        if (!result.success) {
          notify.error(result.message);
          router.replace("/students");
          return;
        }
        setStudent(result.data);
      } finally {
        setIsFetching(false);
        stopLoading();
      }
    };
    void load();
  }, [studentId, router]);

  const fields = useMemo(
    () => (student ? fieldsWithStudent(student) : studentFields),
    [student],
  );
  const handleSubmit = async (values: Record<string, string>) => {
    startLoading(isEditing ? "Updating student..." : "Creating student...");
    try {
      const data: StudentFieldType = {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        email: values.email,
        age: Number(values.age),
        gender: values.gender as Gender,
        birthDate: new Date(values.birthDate),
        address: [values.address1, values.address2].filter(Boolean).join(", "),
      };
      const result = isEditing
        ? await updateStudentAction(studentId, data)
        : await createStudentAction(data);
      if (!result.success) return notify.error(String(result.message));
      notify.success(String(result.message));
      router.push("/students");
    } finally {
      stopLoading();
    }
  };

  if (isFetching || (isEditing && !student)) return null;
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 animate-float-up">
      <div className="flex w-full max-w-md flex-col">
        <DynamicCardForm
          key={student?.id ?? "new"}
          title={isEditing ? "Edit Student" : "Student Enrollment Form"}
          description={
            isEditing
              ? "Update the student's personal information."
              : "Fill student's personal information."
          }
          fields={fields}
          submitLabel={isEditing ? "Save Changes" : "Submit"}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
