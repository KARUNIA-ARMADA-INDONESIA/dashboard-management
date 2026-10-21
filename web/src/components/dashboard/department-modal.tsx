"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getItemsByDepartment, departmentIconMap } from "@/lib/data";
import type { Department } from "@/lib/types";
import { DashboardItemCard } from "@/components/dashboard/dashboard-item-card";

const tabs = [
  { key: "all", label: "Semua" },
  { key: "Dashboard", label: "Dashboard Eksekutif" },
  { key: "Monitoring", label: "Monitoring Real-time" },
  { key: "Laporan", label: "Laporan Berkala" },
  { key: "favorite", label: "Favorit Saya" },
];

type Props = {
  department: Department | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DepartmentModal({ department, open, onOpenChange }: Props) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    if (!department) return [];
    let list = getItemsByDepartment(department.slug);
    if (tab === "favorite") {
      list = list.filter((i) => i.favorite);
    } else if (tab !== "all") {
      list = list.filter((i) => i.category === tab);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [department, tab, query]);

  const Icon = department?.iconName ? departmentIconMap[department.iconName] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        {department && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2.5 pr-8">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {Icon && <Icon className="h-5 w-5" />}
                </span>
                <DialogTitle className="text-lg">{department.name}</DialogTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Pilih dashboard atau laporan yang ingin dibuka
              </p>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={`Cari dashboard atau laporan ${department.name}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      tab === t.key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <DashboardItemCard key={item.slug} item={item} />
                ))}
              </div>

              {items.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Tidak ada hasil yang cocok.
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Menampilkan {items.length} dari{" "}
                  {getItemsByDepartment(department.slug).length} dashboard/laporan
                </p>
                <Link
                  href={`/dashboard/${department.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Lihat Overview Departemen
                </Link>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
