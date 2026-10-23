"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PAGE_SIZES,
  toSearchParams,
  type AttendanceFilters,
} from "@/lib/attendance-filters";
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";

const statusClass: Record<AttendanceStatus, string> = {
  Hadir: "bg-emerald-100 text-emerald-700",
  Terlambat: "bg-amber-100 text-amber-700",
  "Tidak Hadir": "bg-red-100 text-red-700",
  Cuti: "bg-blue-100 text-blue-700",
  Sakit: "bg-violet-100 text-violet-700",
  Libur: "bg-slate-100 text-slate-700",
};

const columns = [
  "NO.",
  "TANGGAL",
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
  total: number;
  filters: AttendanceFilters;
  exportHref: string;
};

/** Nomor halaman yang ditampilkan: 1 … (p-1) p (p+1) … last */
function pageWindow(page: number, totalPages: number): (number | "…")[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export function AttendanceTable({ records, total, filters, exportHref }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, startTransition] = useTransition();

  const { page, pageSize } = filters;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const go = (next: Partial<AttendanceFilters>) =>
    startTransition(() => {
      router.push(`${pathname}?${toSearchParams({ ...filters, ...next })}`, {
        scroll: false,
      });
    });

  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            Daftar Kehadiran Karyawan
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          </h3>
          <p className="text-xs text-muted-foreground">
            {fmt(total)} data kehadiran (karyawan × tanggal)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            items={PAGE_SIZES.map((n) => ({ value: String(n), label: `${n} baris` }))}
            value={String(pageSize)}
            onValueChange={(v) => go({ pageSize: Number(v), page: 1 })}
          >
            <SelectTrigger className="h-9 w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} baris
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <a
            href={exportHref}
            aria-label="Export CSV"
            className="inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </a>
        </div>
      </div>

      <div className={cn("overflow-x-auto transition-opacity", loading && "opacity-60")}>
        <table className="w-full min-w-[1080px] text-left text-sm">
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
            {records.map((r, i) => (
              <tr key={r.key} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground">{start + i}</td>
                <td className="px-4 py-3 text-xs">{r.date}</td>
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
                      "whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium",
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
            {records.length === 0 && (
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
          Menampilkan {fmt(start)} – {fmt(end)} dari {fmt(total)} data
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={page <= 1 || loading}
            onClick={() => go({ page: page - 1 })}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          {pageWindow(page, totalPages).map((n, i) =>
            n === "…" ? (
              <span key={`gap-${i}`} className="px-1">
                …
              </span>
            ) : (
              <Button
                key={n}
                variant={n === page ? "default" : "outline"}
                size="sm"
                disabled={loading}
                onClick={() => go({ page: n })}
              >
                {n}
              </Button>
            ),
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={page >= totalPages || loading}
            onClick={() => go({ page: page + 1 })}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
