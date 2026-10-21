"use client";

import { useAttendanceFilter } from "@/lib/hooks/use-attendance-filter";
import { attendanceKpis } from "@/lib/data";
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
};

export function AttendanceDashboard({ department, item }: Props) {
  const { pendingFilters, setPending, apply, reset, filteredRecords } =
    useAttendanceFilter();

  return (
    <div className="space-y-4">
      <DashboardHeader
        department={department}
        item={item}
        lastUpdated="16 Okt 2026 14:57:32 WIB"
      />

      <FilterBar
        filters={pendingFilters}
        onSet={setPending}
        onApply={apply}
        onReset={reset}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {attendanceKpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <AttendanceTrendChart />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <AttendanceDonutChart />
        </div>
      </div>

      <AttendanceTable records={filteredRecords} />
    </div>
  );
}
