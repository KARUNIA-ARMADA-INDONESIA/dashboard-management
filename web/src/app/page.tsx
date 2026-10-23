import { Search, Truck } from "lucide-react";
import { DepartmentSection } from "@/components/dashboard/department-section";
import { HomeShortcuts } from "@/components/dashboard/home-shortcuts";
import { StatCard } from "@/components/dashboard/stat-card";
import { getNavigation, getOverviewStats } from "@/lib/queries/navigation";

// Data dibaca dari database setiap request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ departments, items }, stats] = await Promise.all([
    getNavigation(),
    getOverviewStats(),
  ]);

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6">
      {/* Hero */}
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-card p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Selamat Pagi, Tim{" "}
            <span className="text-primary">Management!</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Akses dashboard, monitoring, dan laporan seluruh departemen Karunia
            dalam satu tempat.
          </p>
          <div className="relative mt-4 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full rounded-md border bg-muted/50 pl-9 pr-12 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Cari departemen, dashboard, atau laporan..."
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ⌘ K
            </kbd>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground">
          <Truck className="absolute -bottom-4 -right-4 h-32 w-32 opacity-15" />
          <p className="text-lg font-bold">Data Akurat</p>
          <p className="text-sm font-medium opacity-90">Keputusan Lebih Cepat</p>
          <p className="mt-2 max-w-[220px] text-xs opacity-80">
            Monitoring bisnis Karunia dalam satu portal.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          iconName="Building2"
          label="Total Group Departemen"
          value={String(stats.totalGroups)}
          note="Group departemen"
        />
        <StatCard
          iconName="LayoutDashboard"
          label="Total Dashboard"
          value={String(stats.totalDashboards)}
          note="Dashboard tersedia"
        />
        <StatCard
          iconName="FileBarChart"
          label="Total Report"
          value={String(stats.totalReports)}
          note="Laporan tersedia"
        />
        <StatCard
          iconName="Clock3"
          label="Terakhir Diperbarui"
          value={stats.lastUpdatedDate}
          note={stats.lastUpdatedTime || "Data absensi terakhir"}
        />
      </section>

      {/* Departments */}
      <div className="mt-8">
        <DepartmentSection departments={departments} items={items} />
      </div>

      {/* Bottom panels */}
      <HomeShortcuts departments={departments} items={items} />
    </main>
  );
}
