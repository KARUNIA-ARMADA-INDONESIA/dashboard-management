"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import type { AttendanceTrend } from "@/lib/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const baseOptions: ApexOptions = {
  chart: {
    type: "line",
    toolbar: { show: false },
    fontFamily: "inherit",
    zoom: { enabled: false },
  },
  colors: ["#16a34a", "#f59e0b", "#ef4444"],
  stroke: {
    curve: "smooth",
    width: [0, 2, 2],
  },
  plotOptions: {
    bar: {
      columnWidth: "55%",
      borderRadius: 3,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    style: { fontSize: "10px", colors: ["#374151"] },
    offsetY: -18,
    formatter: (v: number) => v.toLocaleString("id-ID"),
  },
  markers: { size: [0, 4, 4] },
  xaxis: {
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontSize: "11px" } },
  },
  yaxis: {
    min: 0,
    tickAmount: 5,
    labels: { formatter: (v) => Math.round(v).toString() },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    fontSize: "12px",
    markers: { size: 8 },
  },
  grid: { borderColor: "#f0f0f0", strokeDashArray: 3 },
  tooltip: {
    shared: true,
    intersect: false,
  },
};

export function AttendanceTrendChart({ trend }: { trend: AttendanceTrend }) {
  const options: ApexOptions = {
    ...baseOptions,
    xaxis: { ...baseOptions.xaxis, categories: trend.labels },
  };
  const series: ApexOptions["series"] = [
    { name: "Hadir", type: "column", data: trend.hadir },
    { name: "Terlambat", type: "line", data: trend.terlambat },
    { name: "Tidak Hadir", type: "line", data: trend.tidakHadir },
  ];
  const first = trend.labels[0];
  const last = trend.labels[trend.labels.length - 1];

  return (
    <div>
      <h3 className="text-sm font-semibold">
        Tren Kehadiran {first === last ? first : `${first} – ${last}`}
      </h3>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}
