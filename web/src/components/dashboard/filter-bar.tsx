"use client";

import { RotateCcw, Search } from "lucide-react";
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
import type { AttendanceFilters } from "@/lib/hooks/use-attendance-filter";

const SELECT_FIELDS: {
  key: keyof AttendanceFilters;
  label: string;
  placeholder: string;
  options: string[];
}[] = [
  {
    key: "area",
    label: "Area",
    placeholder: "-- Semua Area --",
    options: ["HOI-BPN", "Site A", "Site B"],
  },
  {
    key: "location",
    label: "Lokasi",
    placeholder: "-- Semua Lokasi --",
    options: [
      "Main Office",
      "Workshop",
      "Pit 1",
      "Pit 2",
      "Pantry Sepinggan",
      "Gudang 2",
      "Lapangan",
    ],
  },
  {
    key: "department",
    label: "Departemen",
    placeholder: "-- Semua Departemen --",
    options: [
      "Human Capital",
      "Engineering",
      "Operation",
      "Finance",
      "HSE",
      "IT & Digitalization",
      "Supply Chain Management",
    ],
  },
  {
    key: "status",
    label: "Status Kehadiran",
    placeholder: "-- Semua Status --",
    options: ["Hadir", "Terlambat", "Tidak Hadir"],
  },
  {
    key: "shift",
    label: "Shift",
    placeholder: "-- Semua Shift --",
    options: ["1", "2"],
  },
  {
    key: "employeeType",
    label: "Jenis Karyawan",
    placeholder: "-- Semua --",
    options: ["Tetap", "Kontrak", "Harian"],
  },
];

type Props = {
  filters: AttendanceFilters;
  onSet: (key: keyof AttendanceFilters, value: string) => void;
  onApply: () => void;
  onReset: () => void;
};

export function FilterBar({ filters, onSet, onApply, onReset }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Tanggal Dinas">
          <Input
            value={filters.dateRange || "16/10/2026 - 16/10/2026"}
            onChange={(e) => onSet("dateRange", e.target.value)}
          />
        </Field>

        {SELECT_FIELDS.map((s) => (
          <Field key={s.key} label={s.label}>
            <Select
              value={filters[s.key] || ""}
              onValueChange={(v) => onSet(s.key, !v || v === "__all__" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={s.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{s.placeholder}</SelectItem>
                {s.options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ))}

        <Field label="NIK / Nama">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari NIK atau Nama Karyawan..."
              value={filters.searchQuery}
              onChange={(e) => onSet("searchQuery", e.target.value)}
            />
          </div>
        </Field>

        <div className="flex items-end gap-2">
          <Button size="sm" className="gap-2" onClick={onApply}>
            <Search className="h-4 w-4" />
            Terapkan Filter
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
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
