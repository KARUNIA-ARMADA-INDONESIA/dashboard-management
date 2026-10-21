"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";

const statusClass: Record<AttendanceStatus, string> = {
  Hadir: "bg-emerald-100 text-emerald-700",
  Terlambat: "bg-amber-100 text-amber-700",
  "Tidak Hadir": "bg-red-100 text-red-700",
};

const columns = [
  "NO.",
  "NIK",
  "NAMA KARYAWAN",
  "DEPARTEMEN",
  "AREA",
  "LOKASI",
  "SHIFT",
  "JAM MASUK",
  "JAM PULANG",
  "STATUS",
  "DURASI KERJA",
  "OT",
];

type Props = {
  records: AttendanceRecord[];
};

export function AttendanceTable({ records }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Secondary client-side search within already-filtered records
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.nik.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q),
    );
  }, [query, records]);

  // Reset page when external records prop changes
  useMemo(() => {
    setPage(1);
  }, [records]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const start = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, filtered.length);

  const handleExport = () => {
    const header = columns.join(",");
    const rows_csv = filtered
      .map((r) =>
        [
          r.id,
          r.nik,
          `"${r.name}"`,
          `"${r.department}"`,
          r.area,
          `"${r.location}"`,
          r.shift,
          r.checkIn,
          r.checkOut,
          r.status,
          `"${r.duration}"`,
          r.overtime,
        ].join(","),
      )
      .join("\n");
    const csv = `${header}\n${rows_csv}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-kehadiran.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Daftar Kehadiran Karyawan</h3>
          <p className="text-xs text-muted-foreground">
            Menampilkan {filtered.length} dari {records.length} data kehadiran
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 w-64 pl-9"
              placeholder="Cari NIK, nama, atau departemen..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["10", "25", "50"].map((n) => (
                <SelectItem key={n} value={n}>
                  {n} baris
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-2"
            onClick={handleExport}
            aria-label="Export CSV"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground">{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.nik}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.department}</td>
                <td className="px-4 py-3">{r.area}</td>
                <td className="px-4 py-3">{r.location}</td>
                <td className="px-4 py-3">{r.shift}</td>
                <td className="px-4 py-3 text-xs">{r.checkIn}</td>
                <td className="px-4 py-3 text-xs">{r.checkOut}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      statusClass[r.status],
                    )}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">{r.duration}</td>
                <td className="px-4 py-3 text-xs">{r.overtime}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  Tidak ada data yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
        <p>
          Showing {start} to {end} of {filtered.length} entries
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              variant={n === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(n)}
            >
              {n}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
