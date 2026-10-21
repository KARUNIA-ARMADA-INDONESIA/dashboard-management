"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { departments, dashboardItems, departmentIconMap } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Department } from "@/lib/types";
import { DepartmentModal } from "@/components/dashboard/department-modal";

const filterTabs = [
  { key: "all", label: "Semua Departemen" },
  { key: "Dashboard", label: "Dashboard" },
  { key: "Monitoring", label: "Monitoring" },
  { key: "Laporan", label: "Laporan" },
];

/** Returns true if a department has at least one item of the given category */
function deptHasCategory(dept: Department, category: string): boolean {
  if (category === "all") return true;
  return dashboardItems.some(
    (i) => i.departmentSlug === dept.slug && i.category === category,
  );
}

export function DepartmentSection() {
  const [openDept, setOpenDept] = useState<Department | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () => departments.filter((d) => deptHasCategory(d, filter)),
    [filter],
  );

  return (
    <section id="departemen" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Pilih Departemen</h2>
          <p className="text-sm text-muted-foreground">
            Klik salah satu departemen untuk melihat daftar dashboard dan
            laporan yang tersedia.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter Departemen">
          {filterTabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={filter === t.key}
              onClick={() => setFilter(t.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filter === t.key
                  ? "bg-primary text-primary-foreground"
                  : "border text-muted-foreground hover:bg-muted",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((dept) => {
          const Icon = departmentIconMap[dept.iconName];
          return (
            <button
              key={dept.slug}
              type="button"
              onClick={() => setOpenDept(dept)}
              className="group flex flex-col rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-semibold leading-tight">{dept.name}</h3>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-primary">
                    {dept.dashboardCount} Dashboard · {dept.reportCount} Laporan
                  </p>
                </div>
              </div>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                {dept.description}
              </p>
              <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Aktif
              </span>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-4 rounded-xl border border-dashed bg-card py-12 text-center text-sm text-muted-foreground">
            Tidak ada departemen dengan kategori ini.
          </div>
        )}
      </div>

      <DepartmentModal
        department={openDept}
        open={openDept !== null}
        onOpenChange={(open) => {
          if (!open) setOpenDept(null);
        }}
      />
    </section>
  );
}
