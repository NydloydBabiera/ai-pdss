"use client";
import DynamicCardForm from "@/_elements/cardForm";
import React, { useState } from "react";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "select" | "radio";
  placeholder: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

const studentFields: Array<FieldConfig> = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter  first name",
    required: true,
  },
  {
    name: "middleName",
    label: "Middle Name",
    type: "text",
    placeholder: "Enter  middle name",
    required: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter  last name",
    required: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "radio",
    placeholder: "Choose gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
    required: true,
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter age",
    required: true,
  },
  {
    name: "birthDate",
    label: "Birth Date",
    type: "date",
    placeholder: "Enter birth date",
    required: true,
  },
  {
    name: "address1",
    label: "Address Line 1",
    type: "text",
    placeholder: "Enter address",
    required: true,
  },
  {
    name: "address2",
    label: "Address Line 2",
    type: "text",
    placeholder: "Enter address",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
  },
];

const gradeLevelFields: Array<FieldConfig> = [
  {
    name: "gradeLevel",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
  },
];

export default function StudentsRegistrationPage() {
  const [isNext, setIsNext] = useState(false);

  return (
    <div className="flex flex-col  items-center justify-center gap-6 p-6 animate-float-up">
      <div className="flex w-full max-w-md flex-col ">
        <DynamicCardForm
          title="Enroll a student"
          description="Fill student's personal information."
          fields={studentFields}
          submitLabel="Next"
          onSubmit={(values) => {
            console.log(values);
            setIsNext(true);
          }}
        />
      </div>
    </div>
  );
}
