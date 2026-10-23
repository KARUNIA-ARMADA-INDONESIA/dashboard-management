import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { ACTIVE_EMPLOYEE } from "@/lib/queries/sql";
import { getLastUpdated } from "@/lib/queries/navigation";
import {
  ATTENDANCE_STATUSES,
  addDays,
  daysBetween,
  todayIso,
  type AttendanceFilters,
} from "@/lib/attendance-filters";
import type {
  AttendanceDashboardData,
  AttendanceFilterOptions,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceTrend,
  Kpi,
} from "@/lib/types";

/*
 * Aturan data kehadiran (disepakati dengan user, Okt 2026):
 *
 * Baris = (karyawan, tanggal). Sumber:
 *   - tr_absens (record terakhir per employee_id + tgl, deleted_at IS NULL)
 *   - karyawan aktif & must_absent = '1' tanpa record di tanggal itu → "Tidak Hadir" (alpa),
 *     hanya untuk tanggal <= hari ini dan >= tanggal masuk (doh).
 *
 * Status dari working_status:
 *   CT/CR/CP → Cuti, S → Sakit, OFF/LIBUR_HO → Libur, PD → Hadir (dinas),
 *   lainnya (D, D6, ...) → Hadir, atau Terlambat jika jam masuk (dibulatkan ke
 *   bawah per menit) > jadwal; tanpa jam masuk → Tidak Hadir.
 *   Jadwal = ms_working_hours paling spesifik yang cocok (company/area/division/
 *   department/jobtitle/level + shift), fallback shift 1 07:00, shift 2 19:00.
 *
 * Lembur (sama dengan algoritma aplikasi HR, di-join ke tr_absens per tgl + employee_id):
 *   reguler: is_realisasi = 2, tipe 'reguler',
 *            (status_ot = 2 AND jenis_spl IS NULL) OR (status_ot = 3 AND jenis_spl = 'Wajib')
 *   SPL:     tipe 'SPL', status_ot = 3
 *   Jam lembur = sum(total_jam).
 */

type Range = { from: string; to: string };

const STATUS_ORDER = Prisma.sql`array_position(
  ARRAY['Terlambat','Tidak Hadir','Hadir','Sakit','Cuti','Libur']::text[], status
)`;

function toInt(value: string): number | null {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** CTE `filtered`: satu baris per (karyawan, tanggal) sesuai filter. */
function filteredCte(range: Range, f: AttendanceFilters, today: string): Prisma.Sql {
  const where: Prisma.Sql[] = [];
  const idFilter = (column: Prisma.Sql, raw: string) => {
    const id = toInt(raw);
    where.push(id === null ? Prisma.sql`FALSE` : Prisma.sql`${column} = ${id}`);
  };
  if (f.area) idFilter(Prisma.sql`area_id`, f.area);
  if (f.location) idFilter(Prisma.sql`location_id`, f.location);
  if (f.group) idFilter(Prisma.sql`group_id`, f.group);
  if (f.department) idFilter(Prisma.sql`department_id`, f.department);
  if (f.shift) idFilter(Prisma.sql`shift_no`, f.shift);
  if (f.status) where.push(Prisma.sql`status = ${f.status}`);
  if (f.employeeType) where.push(Prisma.sql`emp_status = ${f.employeeType}`);
  if (f.q) {
    const like = `%${escapeLike(f.q)}%`;
    where.push(Prisma.sql`(nik ILIKE ${like} OR nama ILIKE ${like})`);
  }
  const whereSql = where.length
    ? Prisma.sql`WHERE ${Prisma.join(where, " AND ")}`
    : Prisma.empty;

  return Prisma.sql`
    WITH
    days AS (
      SELECT gs::date AS tgl
      FROM generate_series(${range.from}::date, LEAST(${range.to}::date, ${today}::date), interval '1 day') gs
    ),
    absen AS (
      SELECT DISTINCT ON (a.employee_id, a.tgl) a.*
      FROM tr_absens a
      WHERE a.deleted_at IS NULL AND a.tgl BETWEEN ${range.from}::date AND ${range.to}::date
      ORDER BY a.employee_id, a.tgl, COALESCE(a.updated_at, a.created_at) DESC NULLS LAST, a.id DESC
    ),
    keys AS (
      SELECT e.id AS employee_id, d.tgl
      FROM ms_employees e
      CROSS JOIN days d
      WHERE ${ACTIVE_EMPLOYEE} AND e.must_absent = '1' AND (e.doh IS NULL OR e.doh <= d.tgl)
      UNION
      SELECT employee_id, tgl FROM absen
    ),
    ovt_reguler AS (
      SELECT tgl, employee_id, sum(total_jam) AS total_jam
      FROM tr_overtime
      WHERE is_realisasi = 2
        AND lower(tipe) = 'reguler'
        AND deleted_at IS NULL
        AND ((status_ot = 2 AND jenis_spl IS NULL) OR (status_ot = 3 AND jenis_spl = 'Wajib'))
        AND tgl BETWEEN ${range.from}::date AND ${range.to}::date
      GROUP BY tgl, employee_id
    ),
    ovt_spl AS (
      SELECT tgl, employee_id, sum(total_jam) AS total_jam
      FROM tr_overtime
      WHERE tipe = 'SPL' AND status_ot = 3 AND deleted_at IS NULL
        AND tgl BETWEEN ${range.from}::date AND ${range.to}::date
      GROUP BY tgl, employee_id
    ),
    base AS (
      SELECT
        k.tgl,
        e.id AS employee_id,
        e.nik,
        e.nama,
        NULLIF(trim(e.status), '') AS emp_status,
        dp.id::int AS department_id,
        dp.name AS department_name,
        dp.department_group_id::int AS group_id,
        COALESCE(a.area_id, e.area_id)::int AS area_id,
        COALESCE(ar.alias, ar.name) AS area_name,
        a.area_point_id::int AS location_id,
        ap.point_name AS location_name,
        x.shift_no,
        x.check_in,
        x.check_out,
        CASE
          WHEN a.id IS NULL THEN 'Tidak Hadir'
          WHEN x.ws IN ('CT', 'CR', 'CP') THEN 'Cuti'
          WHEN x.ws = 'S' THEN 'Sakit'
          WHEN x.ws IN ('OFF', 'LIBUR_HO') THEN 'Libur'
          WHEN x.ws = 'PD' THEN 'Hadir'
          WHEN x.check_in IS NULL THEN 'Tidak Hadir'
          WHEN date_trunc('minute', x.check_in) > k.tgl + COALESCE(
            wh.jam_masuk,
            CASE WHEN x.shift_no = 2 THEN time '19:00' ELSE time '07:00' END
          ) THEN 'Terlambat'
          ELSE 'Hadir'
        END AS status,
        (COALESCE(r.total_jam, 0) + COALESCE(s.total_jam, 0))::float8 AS ot_jam
      FROM keys k
      JOIN ms_employees e ON e.id = k.employee_id
      LEFT JOIN absen a ON a.employee_id = k.employee_id AND a.tgl = k.tgl
      LEFT JOIN ms_departments dp ON dp.id = e.department_id
      LEFT JOIN ms_areas ar ON ar.id = COALESCE(a.area_id, e.area_id)
      LEFT JOIN ms_area_points ap ON ap.id = a.area_point_id
      CROSS JOIN LATERAL (
        SELECT
          CASE WHEN a.shift ~ '^[0-9]+$' THEN a.shift::int END AS shift_no,
          COALESCE(a.jam_masuk, a.jam_on_finger) AS check_in,
          COALESCE(a.jam_keluar, a.jam_off_finger) AS check_out,
          upper(trim(a.working_status)) AS ws
      ) x
      LEFT JOIN LATERAL (
        SELECT w.jam_masuk
        FROM ms_working_hours w
        WHERE a.id IS NOT NULL
          AND w.shift = COALESCE(x.shift_no, 1)
          AND (w.company_id IS NULL OR w.company_id = e.company_id)
          AND (w.area_id IS NULL OR w.area_id = COALESCE(a.area_id, e.area_id))
          AND (w.division_id IS NULL OR w.division_id = e.division_id)
          AND (w.department_id IS NULL OR w.department_id = e.department_id)
          AND (w.jobtitle_id IS NULL OR w.jobtitle_id = e.job_title_id)
          AND (w.level_id IS NULL OR w.level_id = e.level_id)
        ORDER BY
          (w.jobtitle_id IS NOT NULL)::int + (w.level_id IS NOT NULL)::int
          + (w.department_id IS NOT NULL)::int + (w.division_id IS NOT NULL)::int
          + (w.area_id IS NOT NULL)::int + (w.company_id IS NOT NULL)::int DESC,
          w.id DESC
        LIMIT 1
      ) wh ON TRUE
      LEFT JOIN ovt_reguler r ON a.id IS NOT NULL AND r.tgl = a.tgl AND r.employee_id = a.employee_id
      LEFT JOIN ovt_spl s ON a.id IS NOT NULL AND s.tgl = a.tgl AND s.employee_id = a.employee_id
    ),
    filtered AS (
      SELECT * FROM base ${whereSql}
    )
  `;
}

type Summary = {
  rows: number;
  employees: number;
  hadir: number;
  terlambat: number;
  tidak_hadir: number;
  cuti: number;
  sakit: number;
  libur: number;
  ot_jam: number;
};

async function querySummary(range: Range, f: AttendanceFilters, today: string) {
  const [row] = await prisma.$queryRaw<Summary[]>`
    ${filteredCte(range, f, today)}
    SELECT
      count(*)::int AS rows,
      count(DISTINCT employee_id)::int AS employees,
      count(*) FILTER (WHERE status = 'Hadir')::int AS hadir,
      count(*) FILTER (WHERE status = 'Terlambat')::int AS terlambat,
      count(*) FILTER (WHERE status = 'Tidak Hadir')::int AS tidak_hadir,
      count(*) FILTER (WHERE status = 'Cuti')::int AS cuti,
      count(*) FILTER (WHERE status = 'Sakit')::int AS sakit,
      count(*) FILTER (WHERE status = 'Libur')::int AS libur,
      COALESCE(sum(ot_jam), 0)::float8 AS ot_jam
    FROM filtered
  `;
  return row;
}

async function queryTrend(
  range: Range,
  f: AttendanceFilters,
  today: string,
): Promise<AttendanceTrend> {
  const rows = await prisma.$queryRaw<
    { d: string; hadir: number; terlambat: number; tidak_hadir: number }[]
  >`
    ${filteredCte(range, f, today)}
    SELECT
      to_char(tgl, 'YYYY-MM-DD') AS d,
      count(*) FILTER (WHERE status = 'Hadir')::int AS hadir,
      count(*) FILTER (WHERE status = 'Terlambat')::int AS terlambat,
      count(*) FILTER (WHERE status = 'Tidak Hadir')::int AS tidak_hadir
    FROM filtered
    GROUP BY tgl
  `;
  const byDay = new Map(rows.map((r) => [r.d, r]));
  const trend: AttendanceTrend = { labels: [], hadir: [], terlambat: [], tidakHadir: [] };
  for (let d = range.from; d <= range.to; d = addDays(d, 1)) {
    const r = byDay.get(d);
    trend.labels.push(formatShortDate(d));
    trend.hadir.push(r?.hadir ?? 0);
    trend.terlambat.push(r?.terlambat ?? 0);
    trend.tidakHadir.push(r?.tidak_hadir ?? 0);
  }
  return trend;
}

type RowResult = {
  tgl: string;
  employee_id: number;
  nik: string | null;
  nama: string | null;
  department_name: string | null;
  area_name: string | null;
  location_name: string | null;
  shift_no: number | null;
  check_in: string | null;
  check_out: string | null;
  duration_min: number | null;
  status: AttendanceStatus;
  ot_jam: number;
};

async function queryRows(
  range: Range,
  f: AttendanceFilters,
  today: string,
  limit: number,
  offset: number,
): Promise<AttendanceRecord[]> {
  const rows = await prisma.$queryRaw<RowResult[]>`
    ${filteredCte(range, f, today)}
    SELECT
      to_char(tgl, 'DD/MM/YYYY') AS tgl,
      employee_id,
      nik,
      nama,
      department_name,
      area_name,
      location_name,
      shift_no,
      to_char(check_in, 'DD/MM/YYYY HH24:MI') AS check_in,
      to_char(check_out, 'DD/MM/YYYY HH24:MI') AS check_out,
      CASE WHEN check_out > check_in
        THEN (extract(epoch FROM check_out - check_in) / 60)::int
      END AS duration_min,
      status,
      ot_jam
    FROM filtered
    ORDER BY filtered.tgl DESC, ${STATUS_ORDER}, nama, employee_id
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows.map((r) => ({
    key: `${r.employee_id}-${r.tgl}`,
    date: r.tgl,
    nik: r.nik ?? "-",
    name: r.nama ?? "-",
    department: r.department_name ?? "-",
    area: r.area_name ?? "-",
    location: r.location_name ?? "-",
    shift: r.shift_no ? String(r.shift_no) : "-",
    checkIn: r.check_in ?? "-",
    checkOut: r.check_out ?? "-",
    status: r.status,
    duration: formatDuration(r.duration_min),
    overtime: r.ot_jam > 0 ? `${formatNumber(r.ot_jam)} jam` : "-",
  }));
}

async function queryOptions(): Promise<AttendanceFilterOptions> {
  const [areas, locations, groups, departments, shifts, types] = await Promise.all([
    prisma.$queryRaw<{ value: string; label: string }[]>`
      SELECT id::text AS value, COALESCE(alias, name) || ' — ' || name AS label
      FROM ms_areas WHERE deleted_at IS NULL ORDER BY COALESCE(alias, name)
    `,
    prisma.$queryRaw<{ value: string; label: string; areaId: string }[]>`
      SELECT id::text AS value, point_name AS label, area_id::text AS "areaId"
      FROM ms_area_points
      WHERE deleted_at IS NULL AND is_active IS NOT FALSE AND point_name IS NOT NULL
      ORDER BY point_name
    `,
    prisma.$queryRaw<{ value: string; label: string }[]>`
      SELECT id::text AS value, name AS label
      FROM ms_group_department WHERE deleted_at IS NULL
      ORDER BY order_number NULLS LAST, id
    `,
    prisma.$queryRaw<{ value: string; label: string; groupId: string }[]>`
      SELECT d.id::text AS value, d.name AS label, COALESCE(d.department_group_id::text, '') AS "groupId"
      FROM ms_departments d
      WHERE d.deleted_at IS NULL
        AND EXISTS (SELECT 1 FROM ms_employees e WHERE e.department_id = d.id AND ${ACTIVE_EMPLOYEE})
      ORDER BY d.name
    `,
    prisma.$queryRaw<{ value: string }[]>`
      SELECT DISTINCT shift::text AS value FROM ms_working_hours WHERE shift IS NOT NULL ORDER BY 1
    `,
    prisma.$queryRaw<{ value: string }[]>`
      SELECT DISTINCT trim(e.status) AS value
      FROM ms_employees e
      WHERE ${ACTIVE_EMPLOYEE} AND NULLIF(trim(e.status), '') IS NOT NULL
      ORDER BY 1
    `,
  ]);
  return {
    areas,
    locations,
    groups,
    departments,
    shifts: (shifts.length ? shifts : [{ value: "1" }, { value: "2" }]).map((s) => ({
      value: s.value,
      label: `Shift ${s.value}`,
    })),
    employeeTypes: types.map((t) => ({ value: t.value, label: t.value })),
  };
}

export async function getAttendanceDashboard(
  f: AttendanceFilters,
): Promise<AttendanceDashboardData> {
  const today = todayIso();
  const range: Range = { from: f.from, to: f.to };
  const length = daysBetween(f.from, f.to) + 1;
  const previous: Range = { from: addDays(f.from, -length), to: addDays(f.from, -1) };
  // Tren minimal 7 hari agar grafik bermakna.
  const trendRange: Range = {
    from: length >= 7 ? f.from : addDays(f.to, -6),
    to: f.to,
  };

  const [current, prev, trend, rows, options, updated] = await Promise.all([
    querySummary(range, f, today),
    querySummary(previous, f, today),
    queryTrend(trendRange, f, today),
    queryRows(range, f, today, f.pageSize, (f.page - 1) * f.pageSize),
    queryOptions(),
    getLastUpdated(),
  ]);

  const periodLabel = length === 1 ? "dari kemarin" : "dari periode sebelumnya";
  const kpis: Kpi[] = [
    kpi("total", "Total Karyawan", current.employees, prev.employees, periodLabel, "green", "Users"),
    kpi("hadir", "Hadir", current.hadir, prev.hadir, periodLabel, "green", "CheckCircle2"),
    kpi("terlambat", "Terlambat", current.terlambat, prev.terlambat, periodLabel, "amber", "Clock"),
    kpi("tidak-hadir", "Tidak Hadir", current.tidak_hadir, prev.tidak_hadir, periodLabel, "red", "XCircle"),
    kpi("overtime", "Overtime (jam)", current.ot_jam, prev.ot_jam, periodLabel, "purple", "Timer"),
  ];

  const counts: Record<AttendanceStatus, number> = {
    Hadir: current.hadir,
    Terlambat: current.terlambat,
    Cuti: current.cuti,
    Sakit: current.sakit,
    Libur: current.libur,
    "Tidak Hadir": current.tidak_hadir,
  };

  return {
    kpis,
    trend,
    distribution: {
      total: current.rows,
      segments: ATTENDANCE_STATUSES.map((label) => ({
        label,
        value: counts[label],
        percent: formatPercent(current.rows ? (counts[label] / current.rows) * 100 : 0),
      })),
    },
    rows,
    totalRows: current.rows,
    options,
    lastUpdated: updated.label,
  };
}

/** Semua baris (tanpa paging) untuk export CSV. */
export async function getAttendanceRowsForExport(
  f: AttendanceFilters,
  limit = 100_000,
): Promise<AttendanceRecord[]> {
  return queryRows({ from: f.from, to: f.to }, f, todayIso(), limit, 0);
}

// ---------------------------------------------------------------------------

function kpi(
  key: string,
  label: string,
  value: number,
  previous: number,
  periodLabel: string,
  tone: Kpi["tone"],
  iconName: string,
): Kpi {
  let change: string;
  let direction: Kpi["direction"];
  if (previous === 0) {
    direction = value > 0 ? "up" : "flat";
    change = value > 0 ? `naik ${periodLabel}` : `sama ${periodLabel}`;
  } else {
    const pct = ((value - previous) / previous) * 100;
    direction = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
    change = `${formatPercent(Math.abs(pct))} ${periodLabel}`;
  }
  return { key, label, value: formatNumber(value), change, direction, tone, iconName };
}

const numberFormat = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

function formatNumber(n: number): string {
  return numberFormat.format(n);
}

function formatPercent(n: number): string {
  return `${numberFormat.format(n)}%`;
}

function formatDuration(minutes: number | null): string {
  if (minutes === null || minutes <= 0) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h} jam ${m} menit` : `${m} menit`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]}`;
}
