"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { attendanceDistribution } from "@/lib/data";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const colors = ["#22c55e", "#f59e0b", "#ef4444", "#94a3b8"];

const options: ApexOptions = {
  chart: {
    type: "donut",
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  labels: attendanceDistribution.segments.map((s) => s.label),
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
            label: "Total Karyawan",
            fontSize: "11px",
            color: "#6b7280",
            formatter: () => attendanceDistribution.total.toLocaleString("id-ID"),
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

const series = attendanceDistribution.segments.map((s) => s.value);

export function AttendanceDonutChart() {
  return (
    <div>
      <h3 className="text-sm font-semibold">Distribusi Kehadiran Hari Ini</h3>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative shrink-0">
          <Chart options={options} series={series} type="donut" height={220} width={220} />
        </div>
        <ul className="flex flex-1 flex-col gap-3">
          {attendanceDistribution.segments.map((s, i) => (
            <li key={s.label} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: colors[i] }}
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
