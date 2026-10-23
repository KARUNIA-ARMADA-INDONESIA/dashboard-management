import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db";
import { groupIconName } from "@/lib/icons";
import { ACTIVE_EMPLOYEE, isMissingTableError } from "@/lib/queries/sql";
import { APP_TIMEZONE_LABEL } from "@/lib/attendance-filters";
import type {
  DashboardCategory,
  DashboardItem,
  Department,
  NavigationData,
  OverviewStats,
} from "@/lib/types";

/** "Site Management" -> "site-management", "L&D" -> "l-d" */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type GroupRow = {
  id: number;
  name: string | null;
  description: string | null;
  department_names: string[];
  employee_count: number;
};

async function fetchGroups(): Promise<GroupRow[]> {
  return prisma.$queryRaw<GroupRow[]>`
    SELECT
      g.id::int AS id,
      g.name,
      g.description,
      COALESCE(
        array_agg(DISTINCT d.name ORDER BY d.name) FILTER (WHERE d.id IS NOT NULL),
        '{}'
      ) AS department_names,
      (
        SELECT count(*)::int
        FROM ms_employees e
        JOIN ms_departments d2 ON d2.id = e.department_id
        WHERE d2.department_group_id = g.id AND ${ACTIVE_EMPLOYEE}
      ) AS employee_count
    FROM ms_group_department g
    LEFT JOIN ms_departments d
      ON d.department_group_id = g.id AND d.deleted_at IS NULL
    WHERE g.deleted_at IS NULL
    GROUP BY g.id
    ORDER BY g.order_number NULLS LAST, g.id
  `;
}

async function fetchFeatures() {
  try {
    return await prisma.dashboardFeature.findMany({
      where: { active: true, deletedAt: null },
      orderBy: [{ orderNumber: "asc" }, { id: "asc" }],
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn(
        "[navigation] Tabel ms_dashboard_features belum ada — jalankan prisma/scripts/001_create_ms_dashboard_features.sql",
      );
      return [];
    }
    throw error;
  }
}

/** Group departemen + fitur dashboard, sekali per request. */
export const getNavigation = cache(async (): Promise<NavigationData> => {
  const [groups, features] = await Promise.all([fetchGroups(), fetchFeatures()]);

  const slugById = new Map<number, string>();
  const departments: Department[] = groups.map((g) => {
    const name = g.name?.trim() || `Group ${g.id}`;
    const slug = slugify(name) || String(g.id);
    slugById.set(g.id, slug);
    const groupFeatures = features.filter((f) => f.groupDepartmentId === g.id);
    return {
      id: g.id,
      slug,
      name,
      description:
        g.description?.trim() ||
        (g.department_names.length > 0
          ? g.department_names.join(", ")
          : "Belum ada departemen di group ini."),
      departmentNames: g.department_names,
      employeeCount: g.employee_count,
      dashboardCount: groupFeatures.filter((f) => f.category !== "Laporan").length,
      reportCount: groupFeatures.filter((f) => f.category === "Laporan").length,
      availableCount: groupFeatures.filter((f) => f.componentKey !== null).length,
      iconName: groupIconName(name),
    };
  });

  const items: DashboardItem[] = features
    .filter((f) => slugById.has(f.groupDepartmentId))
    .map((f) => ({
      id: f.id,
      slug: f.slug,
      title: f.title,
      category: f.category as DashboardCategory,
      description: f.description ?? "",
      departmentSlug: slugById.get(f.groupDepartmentId)!,
      componentKey: f.componentKey,
    }));

  return { departments, items };
});

export async function getDepartment(slug: string): Promise<Department | undefined> {
  const { departments } = await getNavigation();
  return departments.find((d) => d.slug === slug);
}

export async function getItemsByDepartment(slug: string): Promise<DashboardItem[]> {
  const { items } = await getNavigation();
  return items.filter((i) => i.departmentSlug === slug);
}

export async function getItem(
  departmentSlug: string,
  slug: string,
): Promise<DashboardItem | undefined> {
  const items = await getItemsByDepartment(departmentSlug);
  return items.find((i) => i.slug === slug);
}

/** Waktu data absen terakhir masuk/diubah, dipakai sebagai "Terakhir Diperbarui". */
export const getLastUpdated = cache(
  async (): Promise<{ date: string; time: string; label: string }> => {
    const [row] = await prisma.$queryRaw<{ date: string | null; time: string | null }[]>`
      SELECT
        to_char(t, 'DD Mon YYYY') AS date,
        to_char(t, 'HH24:MI:SS') AS time
      FROM (
        SELECT max(COALESCE(updated_at, created_at)) AS t
        FROM tr_absens
        WHERE deleted_at IS NULL AND COALESCE(updated_at, created_at) <= now() + interval '1 day'
      ) x
    `;
    const date = row?.date ?? "-";
    const time = row?.time ? `${row.time} ${APP_TIMEZONE_LABEL}` : "";
    return { date, time, label: time ? `${date} ${time}` : date };
  },
);

export async function getOverviewStats(): Promise<OverviewStats> {
  const [{ departments, items }, updated] = await Promise.all([
    getNavigation(),
    getLastUpdated(),
  ]);
  return {
    totalGroups: departments.length,
    totalDashboards: items.filter((i) => i.category !== "Laporan").length,
    totalReports: items.filter((i) => i.category === "Laporan").length,
    lastUpdatedDate: updated.date,
    lastUpdatedTime: updated.time,
  };
}
