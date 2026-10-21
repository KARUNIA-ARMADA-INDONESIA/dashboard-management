import Link from "next/link";
import {
  Clock3,
  Search,
  Star,
  Truck,
} from "lucide-react";
import { DepartmentSection } from "@/components/dashboard/department-section";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  activityEvents,
  favoriteEntries,
  getDepartment,
  getDepartmentOfItem,
  getItem,
  overviewStats,
  recentEntries,
} from "@/lib/data";

export default function Home() {
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
          label="Total Departemen"
          value={String(overviewStats.totalDepartments)}
          note="Departemen aktif"
        />
        <StatCard
          iconName="LayoutDashboard"
          label="Total Dashboard"
          value={String(overviewStats.totalDashboards)}
          note="Dashboard tersedia"
        />
        <StatCard
          iconName="FileBarChart"
          label="Total Report"
          value={String(overviewStats.totalReports)}
          note="Laporan tersedia"
        />
        <StatCard
          iconName="Clock3"
          label="Terakhir Diperbarui"
          value="16 Okt 2026"
          note="14:57:32 WIB"
        />
      </section>

      {/* Departments */}
      <div className="mt-8">
        <DepartmentSection />
      </div>

      {/* Bottom panels */}
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <Panel
          id="favorit"
          title="Dashboard Favorit Saya"
          action={{ href: "/#favorit", label: "Lihat Semua" }}
        >
          <ul className="divide-y">
            {favoriteEntries.map((entry) => {
              const item = getItem(entry.slug);
              const dept = getDepartment(entry.departmentSlug);
              if (!item || !dept) return null;
              return (
                <li key={entry.slug}>
                  <Link
                    href={`/dashboard/${dept.slug}/${item.slug}`}
                    className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Departemen {dept.name}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          id="terakhir"
          title="Terakhir Dibuka"
          action={{ href: "/#terakhir", label: "Lihat Semua" }}
        >
          <ul className="divide-y">
            {recentEntries.map((entry) => {
              const item = getItem(entry.slug);
              const dept = getDepartmentOfItem(entry.slug);
              if (!item || !dept) return null;
              return (
                <li key={entry.slug}>
                  <Link
                    href={`/dashboard/${dept.slug}/${item.slug}`}
                    className="block px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {dept.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {entry.time}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          id="aktivitas"
          title="Aktivitas Sistem"
          action={{ href: "/#aktivitas", label: "Lihat Semua" }}
        >
          <ul className="divide-y">
            {activityEvents.map((event) => (
              <li key={event.id} className="flex gap-3 px-4 py-3">
                <span
                  className={
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full " +
                    (event.type === "success"
                      ? "bg-emerald-500"
                      : event.type === "warning"
                        ? "bg-amber-500"
                        : "bg-red-500")
                  }
                />
                <div className="min-w-0">
                  <p className="truncate text-sm">{event.label}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </main>
  );
}

function Panel({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link
          href={action.href}
          className="text-xs font-medium text-primary hover:underline"
        >
          {action.label}
        </Link>
      </div>
      {children}
    </section>
  );
}
