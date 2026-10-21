import { BarChart3, Clock, Construction, FileText } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import type { DashboardItem, Department } from "@/lib/types";

type Props = {
  department: Department;
  item: DashboardItem;
};

const categoryConfig = {
  Dashboard: {
    icon: BarChart3,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: "Dashboard Eksekutif",
    note: "Tampilan ringkasan KPI, grafik tren, dan indikator performa utama akan tersedia setelah integrasi data.",
  },
  Monitoring: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Monitoring Real-time",
    note: "Data monitoring real-time, alert sistem, dan indikator live akan tersedia setelah koneksi ke sumber data.",
  },
  Laporan: {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Laporan Berkala",
    note: "Laporan periodik, tabel data, dan export dokumen akan tersedia setelah integrasi database.",
  },
};

export function FeaturePlaceholder({ department, item }: Props) {
  const config = categoryConfig[item.category];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      <DashboardHeader
        department={department}
        item={item}
        lastUpdated="16 Okt 2026 14:57:32 WIB"
      />

      {/* Coming Soon Card */}
      <div className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-8`}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ${config.color}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm">
              <Construction className="h-3.5 w-3.5 text-orange-500" />
              Dalam Pengembangan
            </div>
            <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{config.label}</p>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{config.note}</p>
        </div>
      </div>

      {/* Skeleton preview — menampilkan struktur konten yang akan datang */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
            <div className="mt-3 h-3 w-24 rounded bg-muted animate-pulse" />
            <div className="mt-2 h-7 w-16 rounded bg-muted animate-pulse" />
            <div className="mt-2 h-2.5 w-28 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="h-4 w-48 rounded bg-muted animate-pulse" />
            <div className="mt-4 h-[260px] rounded-lg bg-muted/50 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="h-4 w-56 rounded bg-muted animate-pulse" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
