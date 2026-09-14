"use client";
import { useConfirmation } from "@/_elements/confirmationDialog";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notify } from "@/lib/notifications";
import { fetchEnrollmentAction, removeEnrollmentAction, saveEnrollmentAction } from "./actions";

type EnrollmentData = Extract<Awaited<ReturnType<typeof fetchEnrollmentAction>>, { success: true }>["data"];
const yearLabel = (year: EnrollmentData["years"][number]) => `${new Date(year.start).getUTCFullYear()} – ${new Date(year.end).getUTCFullYear()}${year.isCurrent ? " (Current)" : ""}`;
const levelLabel = (level: EnrollmentData["levels"][number]) => `${level.department} / ${level.level} / ${level.class}`;
const studentName = (student: EnrollmentData["students"][number]) => `${student.lastName}, ${student.firstName} ${student.middleName}`.trim();

export default function EnrollmentPage() {
  const { confirm, confirmationDialog } = useConfirmation();
  const [data, setData] = useState<EnrollmentData>();
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [yearId, setYearId] = useState<string | null>(null);
  const [levelId, setLevelId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchEnrollmentAction().then((result) => {
      if (cancelled) return;
      if (!result.success) { setError(result.message); return; }
      setData(result.data);
      const year = result.data.years.find((item) => item.isCurrent) ?? result.data.years[0];
      setYearId(year ? String(year.id) : null);
    }).catch(() => {
      if (!cancelled) setError("Unable to load enrollment. Please try again.");
    });
    return () => { cancelled = true; };
  }, [retry]);

  const enrollments = data?.enrollments.filter((item) => String(item.academicYearId) === yearId) ?? [];
  const matches = (student: EnrollmentData["students"][number]) => `${studentName(student)} ${student.idCode}`.toLowerCase().includes(query.trim().toLowerCase());
  const students = data?.students.filter((student) => student.isActive && matches(student)) ?? [];
  const getLevel = (id: number) => data?.levels.find((item) => item.id === id);

  async function save() {
    if (!yearId || !levelId || !selected.length || busy) return;
    const transfers = enrollments.filter((item) => selected.includes(item.studentId) && String(item.academicLevelId) !== levelId);
    if (transfers.length && !await confirm(`Move ${new Set(transfers.map((item) => item.studentId)).size} selected student(s) from their existing grade/class to the selected level for this academic year?`)) return;
    setBusy(true);
    try {
      const result = await saveEnrollmentAction(Number(yearId), Number(levelId), selected);
      if (!result.success) return notify.error(result.message);
      setData((current) => current ? { ...current, enrollments: [...current.enrollments.filter((item) => String(item.academicYearId) !== yearId), ...result.data] } : current);
      setSelected([]);
      notify.success(result.message);
    } catch { notify.error("Unable to save enrollment. Please try again."); }
    finally { setBusy(false); }
  }

  async function remove(id: number) {
    if (busy || !await confirm("Remove this student's enrollment for this academic year?", { title: "Remove confirmation", confirmLabel: "Remove", destructive: true })) return;
    setBusy(true);
    try {
      const result = await removeEnrollmentAction(id);
      if (!result.success) return notify.error(result.message);
      setData((current) => current ? { ...current, enrollments: current.enrollments.filter((item) => item.id !== id) } : current);
      notify.success(result.message);
    } catch { notify.error("Unable to remove enrollment. Please try again."); }
    finally { setBusy(false); }
  }

  return <div className="space-y-6 p-4 md:p-6">
    {confirmationDialog}
    <div><h1 className="text-2xl font-semibold tracking-tight">Student enrollment</h1><p className="mt-1 text-sm text-muted-foreground">Assign students to a grade level and class for each academic year.</p></div>
    {error ? <Card><CardContent className="space-y-4 py-6"><p role="alert">{error}</p><Button onClick={() => { setError(""); setRetry((value) => value + 1); }}>Try again</Button></CardContent></Card> : !data ? <p role="status">Loading enrollment...</p> : <>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="size-5" /> Enrollment details</CardTitle><CardDescription>Select an academic year and destination grade, then choose students below.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="enrollment-year">Academic year</Label><Select value={yearId} disabled={busy} onValueChange={async (value) => { if (selected.length && !await confirm("Clear your student selection and switch academic year?", { title: "Unsaved changes", confirmLabel: "Clear", destructive: false })) return; setYearId(value); setSelected([]); }}><SelectTrigger id="enrollment-year" className="w-full"><SelectValue placeholder="Select academic year" /></SelectTrigger><SelectContent>{data.years.map((year) => <SelectItem key={year.id} value={String(year.id)}>{yearLabel(year)}</SelectItem>)}</SelectContent></Select>{!data.years.length && <Link className="text-sm underline" href="/academicYear">Create an academic year</Link>}</div>
          <div className="space-y-2"><Label htmlFor="enrollment-level">Grade level / Class</Label><Select value={levelId} disabled={busy} onValueChange={setLevelId}><SelectTrigger id="enrollment-level" className="w-full"><SelectValue placeholder="Select grade level and class" /></SelectTrigger><SelectContent>{data.levels.map((level) => <SelectItem key={level.id} value={String(level.id)}>{levelLabel(level)}</SelectItem>)}</SelectContent></Select>{!data.levels.length && <Link className="text-sm underline" href="/levels">Create a grade level</Link>}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Select students</CardTitle><CardDescription>Existing enrollments are shown for the selected year. Saving updates selected students only.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <Input aria-label="Search students" placeholder="Search by student name or ID..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="flex flex-wrap items-center justify-between gap-2"><p role="status" className="text-sm text-muted-foreground">{selected.length} selected</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={busy || !yearId || !students.length} onClick={() => setSelected((current) => [...new Set([...current, ...students.map((student) => student.id)])])}>Select visible</Button><Button variant="ghost" size="sm" disabled={busy || !selected.length} onClick={() => setSelected([])}>Clear selection</Button></div></div>
          <div className="max-h-96 divide-y overflow-y-auto rounded-lg border">{students.map((student) => {
            const enrollment = enrollments.find((item) => item.studentId === student.id);
            const assignedLevel = enrollment && getLevel(enrollment.academicLevelId);
            return <label key={student.id} className="flex cursor-pointer items-start gap-3 p-4 hover:bg-muted/50"><input type="checkbox" className="mt-1 size-4 accent-primary" disabled={busy || !yearId} checked={selected.includes(student.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, student.id] : current.filter((id) => id !== student.id))} /><span><span className="block text-sm font-medium">{studentName(student)}</span><span className="block text-xs text-muted-foreground">{student.idCode}</span><span className="mt-1 block text-xs text-muted-foreground">{!yearId ? "Select an academic year" : assignedLevel ? `Enrolled: ${levelLabel(assignedLevel)}` : "Not enrolled in this academic year"}</span></span></label>;
          })}{!students.length && <p className="p-8 text-center text-sm text-muted-foreground">{query ? "No students match your search." : <>No active students available. <Link href="/students/registration" className="underline">Register a student</Link> to get started.</>}</p>}</div>
          <div className="flex justify-end"><Button disabled={busy || !yearId || !levelId || !selected.length} onClick={() => void save()}><Save className="size-4" />{busy ? "Working..." : "Save enrollment"}</Button></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Enrolled students</CardTitle><CardDescription>{enrollments.length} enrollment(s) for the selected academic year. Search above also filters this list.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Student ID</TableHead><TableHead>Grade / Class</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
        {enrollments.filter((item) => { const student = data.students.find((student) => student.id === item.studentId); return student && matches(student); }).map((item) => {
          const student = data.students.find((student) => student.id === item.studentId)!;
          const level = getLevel(item.academicLevelId);
          return <TableRow key={item.id}><TableCell>{studentName(student)}{!student.isActive && " (Inactive)"}</TableCell><TableCell>{student.idCode}</TableCell><TableCell>{level ? levelLabel(level) : "Unavailable"}</TableCell><TableCell><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" aria-label={`Edit enrollment for ${studentName(student)}`} disabled={busy || !student.isActive} onClick={async () => { if (selected.length && !await confirm("Replace your current student selection with this student?", { title: "Unsaved changes", confirmLabel: "Replace", destructive: false })) return; setSelected([student.id]); setLevelId(String(item.academicLevelId)); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" aria-label={`Remove enrollment for ${studentName(student)}`} disabled={busy} onClick={() => void remove(item.id)}><Trash2 className="size-4" /></Button></div></TableCell></TableRow>;
        })}
        {!enrollments.some((item) => { const student = data.students.find((student) => student.id === item.studentId); return student && matches(student); }) && <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">{yearId ? "No enrollments found." : "Select an academic year to view enrollments."}</TableCell></TableRow>}
      </TableBody></Table></CardContent></Card>
    </>}
  </div>;
}
