"use client";
import { useConfirmation } from "@/_elements/confirmationDialog";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notifications";
import {
  fetchSubjectAssignmentsAction,
  saveSubjectAssignmentsAction,
} from "./actions";

type AssignmentData = Extract<
  Awaited<ReturnType<typeof fetchSubjectAssignmentsAction>>,
  { success: true }
>["data"];

export default function SubjectAssignmentPage() {
  const { confirm, confirmationDialog } = useConfirmation();
  const [data, setData] = useState<AssignmentData>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [levelId, setLevelId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const result = await fetchSubjectAssignmentsAction();
      if (result.success) setData(result.data);
      else setError(result.message);
    } catch {
      setError("Unable to load subject assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    void fetchSubjectAssignmentsAction()
      .then((result) => {
        if (cancelled) return;
        if (result.success) setData(result.data);
        else setError(result.message);
      })
      .catch(() => {
        if (!cancelled)
          setError("Unable to load subject assignments. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const level = data?.levels.find((item) => String(item.id) === levelId);
  const savedIds =
    level?.subjectAssignments.map((item) => item.subjectId) ?? [];
  const dirty =
    selected.length !== savedIds.length ||
    selected.some((id) => !savedIds.includes(id));
  const subjects =
    data?.subjects.filter(
      (subject) => subject.isActive || savedIds.includes(subject.id),
    ) ?? [];
  const visibleSubjects = subjects.filter((subject) =>
    `${subject.code} ${subject.title} ${subject.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  async function selectLevel(value: string | null) {
    if (dirty && !await confirm("Discard unsaved assignment changes?", { title: "Unsaved changes", confirmLabel: "Discard", destructive: false })) return;
    setLevelId(value);
    setSelected(
      data?.levels
        .find((item) => String(item.id) === value)
        ?.subjectAssignments.map((item) => item.subjectId) ?? [],
    );
    setQuery("");
  }

  async function save() {
    if (!level || saving) return;
    setSaving(true);
    try {
      const result = await saveSubjectAssignmentsAction(level.id, selected);
      if (!result.success) return notify.error(result.message);
      setData((current) =>
        current
          ? {
              ...current,
              levels: current.levels.map((item) =>
                item.id === level.id
                  ? {
                      ...item,
                      subjectAssignments: selected.map((subjectId) => ({
                        subjectId,
                      })),
                    }
                  : item,
              ),
            }
          : current,
      );
      notify.success(result.message);
    } catch {
      notify.error("Unable to save assignments. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {confirmationDialog}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Subject assignment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Match subjects to academic levels and classes.
        </p>
      </div>

      {loading ? (
        <p role="status" className="py-12 text-center text-muted-foreground">
          Loading subject assignments...
        </p>
      ) : error ? (
        <Card>
          <CardContent className="space-y-4 py-6">
            <p role="alert">{error}</p>
            <Button variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="size-5" /> Academic level
              </CardTitle>
              <CardDescription>
                Choose the level and class whose subjects you want to manage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {data?.levels.length ? (
                <div className="space-y-2">
                  <Label htmlFor="academic-level">Level and class</Label>
                  <Select
                    value={levelId}
                    onValueChange={selectLevel}
                    disabled={saving}
                  >
                    <SelectTrigger id="academic-level" className="w-full">
                      <SelectValue placeholder="Select academic level" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.levels.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.department} / {item.level} / {item.class}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No academic levels yet.{" "}
                  <Link href="/levels" className="text-primary underline">
                    Create an academic level
                  </Link>{" "}
                  to start assigning subjects.
                </p>
              )}
              {level && (
                <div className="space-y-4 rounded-lg bg-muted/50 p-4 text-sm">
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-muted-foreground">Department</dt>
                      <dd className="font-medium">{level.department}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">
                        Grade / Year level
                      </dt>
                      <dd className="font-medium">{level.level}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Section / Class</dt>
                      <dd className="font-medium">{level.class}</dd>
                    </div>
                  </dl>
                  <p className="border-t pt-3">
                    <span className="font-semibold">{savedIds.length}</span>{" "}
                    saved subject assignments
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                A subject can be assigned to more than one academic level.
                Uncheck a subject to remove its assignment, then save.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5" /> Subjects
              </CardTitle>
              <CardDescription>
                {level
                  ? `Select subjects for ${level.level} / ${level.class}.`
                  : "Select an academic level to view and edit its subjects."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!level ? (
                <div className="rounded-lg border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
                  Choose an academic level to get started.
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      aria-label="Search subjects"
                      className="pl-9"
                      placeholder="Search by code, title, or description..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p role="status" className="text-muted-foreground">
                      {selected.length} selected
                      {dirty ? " · Unsaved changes" : ""}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          saving ||
                          !visibleSubjects.some(
                            (subject) =>
                              subject.isActive &&
                              !selected.includes(subject.id),
                          )
                        }
                        onClick={() =>
                          setSelected((current) => [
                            ...new Set([
                              ...current,
                              ...visibleSubjects
                                .filter((subject) => subject.isActive)
                                .map((subject) => subject.id),
                            ]),
                          ])
                        }
                      >
                        Select visible
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={saving || !selected.length}
                        onClick={() => setSelected([])}
                      >
                        Clear selection
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[480px] overflow-y-auto rounded-lg border divide-y">
                    {visibleSubjects.length ? (
                      visibleSubjects.map((subject) => (
                        <label
                          key={subject.id}
                          className={`flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/50 ${selected.includes(subject.id) ? "bg-primary/5" : ""}`}
                        >
                          <input
                            type="checkbox"
                            className="mt-1 size-4 accent-primary"
                            checked={selected.includes(subject.id)}
                            disabled={saving}
                            onChange={(event) =>
                              setSelected((current) =>
                                event.target.checked
                                  ? [...current, subject.id]
                                  : current.filter((id) => id !== subject.id),
                              )
                            }
                          />
                          <span className="min-w-0 space-y-1">
                            <span className="block text-sm font-medium">
                              {subject.title}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {subject.code}
                              {!subject.isActive ? " · Inactive" : ""}
                            </span>
                            {subject.description && (
                              <span className="block text-sm text-muted-foreground">
                                {subject.description}
                              </span>
                            )}
                          </span>
                        </label>
                      ))
                    ) : (
                      <div className="p-10 text-center text-sm text-muted-foreground">
                        {subjects.length ? (
                          "No subjects match your search."
                        ) : (
                          <>
                            No active subjects available.{" "}
                            <Link
                              href="/subjects"
                              className="text-primary underline"
                            >
                              Manage subjects
                            </Link>{" "}
                            to add one.
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 border-t pt-4">
                    <Button
                      variant="outline"
                      disabled={saving || !dirty}
                      onClick={() => setSelected(savedIds)}
                    >
                      Reset changes
                    </Button>
                    <Button
                      disabled={saving || !dirty}
                      onClick={() => void save()}
                    >
                      <Save className="size-4" />
                      {saving ? "Saving..." : "Save assignments"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
