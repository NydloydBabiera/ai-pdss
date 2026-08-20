"use client";
import { instructorFields, InstructorType } from "@/_config/instructorConfig";
import DynamicCardForm from "@/_elements/cardForm";
import { useLoading } from "@/_elements/loadingScreen";
import { Gender } from "@/generated/prisma/enums";
import { createInstructorAction } from "./actions";
import { notify } from "@/lib/notifications";
import { useRouter } from "next/navigation";

export default function InstructorRegistrationPage() {
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (values: Record<string, string>) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    startLoading("Creating student...");

    try {
      const instructor: InstructorType = {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        email: values.email,
        age: Number(values.age),
        address: `${values.address1}, ${values.address2}`,
        birthDate: new Date(values.birthDate),
        gender: values.gender as Gender,
      };

      const result = await createInstructorAction(instructor);
      console.log("🚀 ~ handleSubmit ~ result:", result);

      if (!result.success) {
        notify.error(result.message as any);
        console.error(result.message);
        return;
      }

      router.push("/instructors");
    } catch (error) {
      console.error(error);
      notify.error(error as any);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex flex-col  items-center justify-center gap-6 p-6 animate-float-up">
      <div className="flex w-full max-w-md flex-col ">
        <DynamicCardForm
          title="Instructor Registration"
          description="Fill instructor's personal information."
          fields={instructorFields}
          submitLabel="Submit"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
