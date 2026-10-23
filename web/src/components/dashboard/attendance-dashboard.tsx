import { getAttendanceDashboard } from "@/lib/queries/attendance";
import { toSearchParams, type AttendanceFilters } from "@/lib/attendance-filters";
import type { DashboardItem, Department } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AttendanceTrendChart } from "@/components/dashboard/attendance-trend-chart";
import { AttendanceDonutChart } from "@/components/dashboard/attendance-donut-chart";
import { AttendanceTable } from "@/components/dashboard/attendance-table";

type Props = {
  department: Department;
  item: DashboardItem;
  filters: AttendanceFilters;
};

export async function AttendanceDashboard({ department, item, filters }: Props) {
  const data = await getAttendanceDashboard(filters);

  const exportParams = toSearchParams({ ...filters, page: 1 });
  const exportHref = `/api/attendance/export?${exportParams}`;
  // Reset state FilterBar ketika filter di URL berubah (selain halaman).
  exportParams.delete("pageSize");
  const filterKey = exportParams.toString();
  const period =
    filters.from === filters.to ? filters.from : `${filters.from} s/d ${filters.to}`;

  return (
    <div className="space-y-4">
      <DashboardHeader
        department={department}
        item={item}
        lastUpdated={data.lastUpdated}
        exportHref={exportHref}
      />

      <FilterBar key={filterKey} filters={filters} options={data.options} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <AttendanceTrendChart trend={data.trend} />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <AttendanceDonutChart
            distribution={data.distribution}
            title={`Distribusi Kehadiran (${period})`}
          />
        </div>
      </div>

      <AttendanceTable
        records={data.rows}
        total={data.totalRows}
        filters={filters}
        exportHref={exportHref}
      />
    </div>
  );
}
