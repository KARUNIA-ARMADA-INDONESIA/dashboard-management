"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  ATTENDANCE_STATUSES,
  MAX_RANGE_DAYS,
  defaultFilters,
  toSearchParams,
  type AttendanceFilters,
} from "@/lib/attendance-filters";
import type { AttendanceFilterOptions, SelectOption } from "@/lib/types";

const ALL = "__all__";

type SelectKey = "area" | "location" | "group" | "department" | "status" | "shift" | "employeeType";

type Props = {
  filters: AttendanceFilters;
  options: AttendanceFilterOptions;
};

/** Filter disimpan di URL; "Terapkan" = navigasi ke URL baru → server query ulang. */
export function FilterBar({ filters, options }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState<AttendanceFilters>(filters);
  const [loading, startTransition] = useTransition();

  const set = <K extends keyof AttendanceFilters>(key: K, value: AttendanceFilters[K]) =>
    setPending((prev) => ({ ...prev, [key]: value }));

  const navigate = (next: AttendanceFilters) => {
    setPending(next);
    startTransition(() => {
      router.push(`${pathname}?${toSearchParams(next)}`, { scroll: false });
    });
  };

  // Opsi berjenjang: lokasi mengikuti area, departemen mengikuti group.
  const locations = useMemo(
    () =>
      pending.area
        ? options.locations.filter((l) => l.areaId === pending.area)
        : options.locations,
    [options.locations, pending.area],
  );
  const departments = useMemo(
    () =>
      pending.group
        ? options.departments.filter((d) => d.groupId === pending.group)
        : options.departments,
    [options.departments, pending.group],
  );

  const fields: {
    key: SelectKey;
    label: string;
    placeholder: string;
    options: SelectOption[];
    onChange?: (v: string) => void;
  }[] = [
    {
      key: "area",
      label: "Area",
      placeholder: "-- Semua Area --",
      options: options.areas,
      onChange: (v) => setPending((p) => ({ ...p, area: v, location: "" })),
    },
    { key: "location", label: "Lokasi", placeholder: "-- Semua Lokasi --", options: locations },
    {
      key: "group",
      label: "Group Departemen",
      placeholder: "-- Semua Group --",
      options: options.groups,
      onChange: (v) => setPending((p) => ({ ...p, group: v, department: "" })),
    },
    {
      key: "department",
      label: "Departemen",
      placeholder: "-- Semua Departemen --",
      options: departments,
    },
    {
      key: "status",
      label: "Status Kehadiran",
      placeholder: "-- Semua Status --",
      options: ATTENDANCE_STATUSES.map((s) => ({ value: s, label: s })),
    },
    { key: "shift", label: "Shift", placeholder: "-- Semua Shift --", options: options.shifts },
    {
      key: "employeeType",
      label: "Status Karyawan",
      placeholder: "-- Semua --",
      options: options.employeeTypes,
    },
  ];

  return (
    <form
      className="rounded-xl border bg-card p-4"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ ...pending, page: 1 });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={`Tanggal Dinas (maks. ${MAX_RANGE_DAYS} hari)`}>
          <div className="flex items-center gap-1.5">
            <Input
              type="date"
              value={pending.from}
              max={pending.to}
              onChange={(e) => e.target.value && set("from", e.target.value)}
            />
            <span className="text-xs text-muted-foreground">s/d</span>
            <Input
              type="date"
              value={pending.to}
              min={pending.from}
              onChange={(e) => e.target.value && set("to", e.target.value)}
            />
          </div>
        </Field>

        {fields.map((f) => {
          const items = [{ value: ALL, label: f.placeholder }, ...f.options];
          return (
            <Field key={f.key} label={f.label}>
              <Select
                items={items}
                value={pending[f.key] || ALL}
                onValueChange={(v) => {
                  const value = !v || v === ALL ? "" : String(v);
                  if (f.onChange) f.onChange(value);
                  else set(f.key, value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {items.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          );
        })}

        <Field label="NIK / Nama">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari NIK atau Nama Karyawan..."
              value={pending.q}
              onChange={(e) => set("q", e.target.value)}
            />
          </div>
        </Field>

        <div className="flex items-end gap-2">
          <Button type="submit" size="sm" className="gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Terapkan Filter
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-2"
            disabled={loading}
            onClick={() => navigate({ ...defaultFilters(), pageSize: filters.pageSize })}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
