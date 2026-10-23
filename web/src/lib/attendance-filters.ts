// Filter dashboard kehadiran disimpan di URL search params, sehingga bisa
// dibaca Server Component (query DB) dan diubah Client Component (router.push).
// File ini dipakai di server & client — jangan import modul server di sini.

import type { AttendanceStatus } from "@/lib/types";

/** Semua tanggal absen di DB memakai waktu lokal site (WITA). */
export const APP_TIMEZONE = "Asia/Makassar";
export const APP_TIMEZONE_LABEL = "WITA";

/** Rentang maksimum agar query (karyawan × hari) tetap ringan. */
export const MAX_RANGE_DAYS = 31;

export const PAGE_SIZES = [10, 25, 50, 100] as const;

export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "Hadir",
  "Terlambat",
  "Cuti",
  "Sakit",
  "Libur",
  "Tidak Hadir",
];

export type AttendanceFilters = {
  from: string;
  to: string;
  area: string;
  location: string;
  group: string;
  department: string;
  status: string;
  shift: string;
  employeeType: string;
  q: string;
  page: number;
  pageSize: number;
};

const TEXT_KEYS = [
  "area",
  "location",
  "group",
  "department",
  "status",
  "shift",
  "employeeType",
  "q",
] as const;

/** YYYY-MM-DD yang benar-benar ada di kalender (tolak 2026-13-99). */
function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Tanggal hari ini (YYYY-MM-DD) di zona waktu aplikasi. */
export function todayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE }).format(now);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000,
  );
}

export function defaultFilters(today = todayIso()): AttendanceFilters {
  return {
    from: today,
    to: today,
    area: "",
    location: "",
    group: "",
    department: "",
    status: "",
    shift: "",
    employeeType: "",
    q: "",
    page: 1,
    pageSize: 10,
  };
}

type RawParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

/** Parse + validasi search params. Nilai tidak valid jatuh ke default. */
export function parseAttendanceFilters(
  params: RawParams,
  today = todayIso(),
): AttendanceFilters {
  const f = defaultFilters(today);

  const from = first(params.from);
  const to = first(params.to);
  if (isIsoDate(to)) f.to = to;
  f.from = isIsoDate(from) ? from : f.to;
  if (f.from > f.to) [f.from, f.to] = [f.to, f.from];
  if (daysBetween(f.from, f.to) >= MAX_RANGE_DAYS) {
    f.from = addDays(f.to, -(MAX_RANGE_DAYS - 1));
  }

  for (const key of TEXT_KEYS) f[key] = first(params[key]).slice(0, 100);
  if (f.status && !ATTENDANCE_STATUSES.includes(f.status as AttendanceStatus)) {
    f.status = "";
  }

  const page = Number.parseInt(first(params.page), 10);
  f.page = Number.isFinite(page) && page > 0 ? page : 1;
  const size = Number.parseInt(first(params.pageSize), 10);
  f.pageSize = (PAGE_SIZES as readonly number[]).includes(size) ? size : 10;

  return f;
}

/** Serialisasi ke query string; nilai default tidak ditulis agar URL pendek. */
export function toSearchParams(filters: AttendanceFilters): URLSearchParams {
  const p = new URLSearchParams();
  p.set("from", filters.from);
  p.set("to", filters.to);
  for (const key of TEXT_KEYS) if (filters[key]) p.set(key, filters[key]);
  if (filters.page > 1) p.set("page", String(filters.page));
  if (filters.pageSize !== 10) p.set("pageSize", String(filters.pageSize));
  return p;
}
