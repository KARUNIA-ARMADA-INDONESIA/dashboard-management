"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import type { AttendanceDashboardData, AttendanceStatus } from "@/lib/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const statusColor: Record<AttendanceStatus, string> = {
  Hadir: "#22c55e",
  Terlambat: "#f59e0b",
  "Tidak Hadir": "#ef4444",
  Cuti: "#3b82f6",
  Sakit: "#a855f7",
  Libur: "#94a3b8",
};

type Props = {
  distribution: AttendanceDashboardData["distribution"];
  title: string;
};

export function AttendanceDonutChart({ distribution, title }: Props) {
  const { segments, total } = distribution;
  const colors = segments.map((s) => statusColor[s.label]);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    labels: segments.map((s) => s.label),
    colors,
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Data",
              fontSize: "11px",
              color: "#6b7280",
              formatter: () => total.toLocaleString("id-ID"),
            },
            value: {
              fontSize: "22px",
              fontWeight: 700,
            },
          },
        },
      },
    },
    stroke: { colors: ["#ffffff"], width: 2 },
  };

  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <div className="relative shrink-0">
          {total > 0 ? (
            <Chart
              options={options}
              series={segments.map((s) => s.value)}
              type="donut"
              height={220}
              width={220}
            />
          ) : (
            <div className="flex h-[220px] w-[220px] items-center justify-center rounded-full border-8 border-muted text-xs text-muted-foreground">
              Tidak ada data
            </div>
          )}
        </div>
        <ul className="flex flex-1 flex-col gap-3">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: statusColor[s.label] }}
                />
                <span className="text-muted-foreground">{s.label}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold">{s.value.toLocaleString("id-ID")}</span>
                <span className="text-muted-foreground">{s.percent}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
