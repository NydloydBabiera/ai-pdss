"use client";

import { ScheduleInput } from "@/_config/scheduleConfig";
import { SubjectData } from "@/_config/subjectConfig";
import { useLoading } from "@/_elements/loadingScreen";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { notify } from "@/lib/notifications";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchSubjectsAction } from "../subjects/action";
import {
  createSchedulesAction,
  deleteScheduleAction,
  fetchSchedules,
  updateScheduleAction,
} from "./actions";

const DAYS = [
  ["Monday", "MON"],
  ["Tuesday", "TUE"],
  ["Wednesday", "WED"],
  ["Thursday", "THU"],
  ["Friday", "FRI"],
  ["Saturday", "SAT"],
  ["Sunday", "SUN"],
] as const;

const blankRow = (): ScheduleInput => ({ day: "", dayCode: "", time: "" });
const displayTime = (value: Date | string) =>
  new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
const inputTime = (value: Date | string) => {
  const date = new Date(value);
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
};

export default function SchedulesPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [subjectId, setSubjectId] = useState<number>();
  const [saved, setSaved] = useState<
    Array<{ id: number; day: string; dayCode: string; time: Date }>
  >([]);
  const [rows, setRows] = useState<ScheduleInput[]>([blankRow()]);
  const [editing, setEditing] = useState<{ id: number; input: ScheduleInput }>();
  const { startLoading, stopLoading } = useLoading();
  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === subjectId),
    [subjects, subjectId],
  );

  useEffect(() => {
    void (async () => {
      startLoading("Fetching subjects...");
      try {
        const result = await fetchSubjectsAction();
        if (!result.success) return notify.error(String(result.message));
        setSubjects((result.data ?? []).filter((subject) => subject.isActive));
      } finally {
        stopLoading();
      }
    })();
    // The loading context currently returns new function identities on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectSubject = async (value: string | null) => {
    if (!value) return;
    const id = Number(value);
    setSubjectId(id);
    setRows([blankRow()]);
    setEditing(undefined);
    startLoading("Fetching schedules...");
    try {
      const result = await fetchSchedules(id);
      if (!result.success) return notify.error(result.message);
      setSaved(result.data?.schedule ?? []);
    } finally {
      stopLoading();
    }
  };

  const updateRow = (index: number, patch: Partial<ScheduleInput>) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row,
      ),
    );
  };

  const save = async () => {
    if (!subjectId) return notify.error("Select a subject first.");
    if (rows.some((row) => !row.day || !row.time)) {
      return notify.error("Complete every day and time field.");
    }
    startLoading("Saving schedules...");
    try {
      const result = await createSchedulesAction(subjectId, rows);
      if (!result.success) return notify.error(result.message);
      setSaved((current) => [...current, ...(result.data ?? [])]);
      setRows([blankRow()]);
      notify.success(result.message);
    } finally {
      stopLoading();
    }
  };

  const saveEdit = async () => {
    if (!editing?.input.day || !editing.input.time) {
      return notify.error("Complete the day and time fields.");
    }
    startLoading("Updating schedule...");
    try {
      const result = await updateScheduleAction(editing.id, editing.input);
      if (!result.success) return notify.error(result.message);
      setSaved((current) => current.map((schedule) =>
        schedule.id === editing.id ? result.data : schedule,
      ));
      setEditing(undefined);
      notify.success(result.message);
    } finally {
      stopLoading();
    }
  };

  const removeSchedule = async (id: number) => {
    if (!window.confirm("Delete this schedule? This action cannot be undone.")) return;
    startLoading("Deleting schedule...");
    try {
      const result = await deleteScheduleAction(id);
      if (!result.success) return notify.error(result.message);
      setSaved((current) => current.filter((schedule) => schedule.id !== id));
      if (editing?.id === id) setEditing(undefined);
      notify.success(result.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Subject schedule</CardTitle>
          <CardDescription>
            Select a subject, then add one or more weekly meeting times.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select
              value={subjectId ? String(subjectId) : null}
              onValueChange={selectSubject}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={String(subject.id)}>
                    {subject.code} — {subject.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Subject code</Label>
            <Input
              value={selectedSubject?.code ?? ""}
              placeholder="—"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={selectedSubject?.description ?? ""}
              placeholder="—"
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New schedule rows</CardTitle>
          <CardDescription>All rows are saved together.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={row.dayCode || null}
                        onValueChange={(code) => {
                          const day = DAYS.find((item) => item[1] === code);
                          if (day)
                            updateRow(index, { day: day[0], dayCode: day[1] });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map(([day, code]) => (
                            <SelectItem key={code} value={code}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={row.time}
                        onChange={(event) =>
                          updateRow(index, { time: event.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Remove row"
                        disabled={rows.length === 1}
                        onClick={() =>
                          setRows((current) =>
                            current.filter((_, rowIndex) => rowIndex !== index),
                          )
                        }
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!subjectId}
              onClick={() => setRows((current) => [...current, blankRow()])}
            >
              <Plus /> Add row
            </Button>
            <Button
              type="button"
              disabled={!subjectId}
              onClick={() => void save()}
            >
              Save schedules
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved schedules</CardTitle>
          <CardDescription>
            {selectedSubject
              ? `Current meeting times for ${selectedSubject.code}.`
              : "Select a subject to view its schedules."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Day code</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saved.length ? (
                  saved.map((schedule) => {
                    const isEditing = editing?.id === schedule.id;
                    return (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          {isEditing ? (
                            <Select
                              value={editing.input.dayCode}
                              onValueChange={(code) => {
                                const day = DAYS.find((item) => item[1] === code);
                                if (day) setEditing({ id: schedule.id, input: { ...editing.input, day: day[0], dayCode: day[1] } });
                              }}
                            >
                              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                              <SelectContent>{DAYS.map(([day, code]) => <SelectItem key={code} value={code}>{day}</SelectItem>)}</SelectContent>
                            </Select>
                          ) : schedule.day}
                        </TableCell>
                        <TableCell>{isEditing ? editing.input.dayCode : schedule.dayCode}</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input type="time" value={editing.input.time} onChange={(event) => setEditing({ id: schedule.id, input: { ...editing.input, time: event.target.value } })} />
                          ) : displayTime(schedule.time)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            {isEditing ? (
                              <>
                                <Button type="button" size="icon" variant="ghost" aria-label="Save schedule" onClick={() => void saveEdit()}><Check /></Button>
                                <Button type="button" size="icon" variant="ghost" aria-label="Cancel editing" onClick={() => setEditing(undefined)}><X /></Button>
                              </>
                            ) : (
                              <>
                                <Button type="button" size="icon" variant="ghost" aria-label="Edit schedule" onClick={() => setEditing({ id: schedule.id, input: { day: schedule.day, dayCode: schedule.dayCode, time: inputTime(schedule.time) } })}><Pencil /></Button>
                                <Button type="button" size="icon" variant="ghost" aria-label="Delete schedule" onClick={() => void removeSchedule(schedule.id)}><Trash2 /></Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No schedules found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
