import type { NextRequest } from "next/server";
import { parseAttendanceFilters } from "@/lib/attendance-filters";
import { getAttendanceRowsForExport } from "@/lib/queries/attendance";

const HEADER = [
  "No",
  "Tanggal",
  "NIK",
  "Nama Karyawan",
  "Departemen",
  "Area",
  "Lokasi",
  "Shift",
  "Jam Masuk",
  "Jam Pulang",
  "Status",
  "Durasi Kerja",
  "OT",
];

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// GET /api/attendance/export?from=YYYY-MM-DD&to=...&area=... — CSV sesuai filter dashboard.
export async function GET(request: NextRequest) {
  const filters = parseAttendanceFilters(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  const rows = await getAttendanceRowsForExport(filters);

  const lines = [
    HEADER.join(","),
    ...rows.map((r, i) =>
      [
        i + 1,
        r.date,
        r.nik,
        r.name,
        r.department,
        r.area,
        r.location,
        r.shift,
        r.checkIn,
        r.checkOut,
        r.status,
        r.duration,
        r.overtime,
      ]
        .map(csvCell)
        .join(","),
    ),
  ];

  // BOM agar Excel membaca UTF-8 dengan benar.
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kehadiran_${filters.from}_${filters.to}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
