import InstructorForm from "../../registration/instructor-form";
import { notFound } from "next/navigation";

export default async function EditInstructorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const instructorId = Number(id);

  if (!Number.isInteger(instructorId) || instructorId <= 0) notFound();

  return <InstructorForm instructorId={instructorId} />;
}
