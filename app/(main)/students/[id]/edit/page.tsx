import StudentForm from "../../registration/student-form";
import { notFound } from "next/navigation";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const studentId = Number(id);
  if (!Number.isInteger(studentId) || studentId <= 0) notFound();
  return <StudentForm studentId={studentId} />;
}
