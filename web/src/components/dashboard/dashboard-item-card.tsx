"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Clock,
  FileBarChart,
  LayoutDashboard,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isFeatureAvailable, type DashboardItem } from "@/lib/types";
import { featureKey, useFavorites } from "@/lib/hooks/use-favorites";

const categoryIcon = {
  Dashboard: LayoutDashboard,
  Monitoring: Activity,
  Laporan: FileBarChart,
};

const categoryBadgeClass = {
  Dashboard: "bg-emerald-100 text-emerald-700",
  Monitoring: "bg-amber-100 text-amber-700",
  Laporan: "bg-blue-100 text-blue-700",
};

export function DashboardItemCard({ item }: { item: DashboardItem }) {
  const { isFavorite, toggle } = useFavorites();
  const Icon = categoryIcon[item.category];
  const href = `/dashboard/${item.departmentSlug}/${item.slug}`;
  const cta = item.category === "Laporan" ? "Buka Laporan" : "Buka Dashboard";
  const key = featureKey(item.departmentSlug, item.slug);
  const fav = isFavorite(key);
  const available = isFeatureAvailable(item);

  return (
    <div
      aria-disabled={!available}
      className={cn(
        "flex flex-col rounded-xl border p-4 transition-all",
        available
          ? "bg-card hover:border-primary/30 hover:shadow-sm"
          : "cursor-not-allowed select-none bg-muted/40 opacity-60 grayscale",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold leading-tight">{item.title}</h3>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                    categoryBadgeClass[item.category],
                  )}
                >
                  {item.category}
                </span>
              </div>
            </div>
            {/* Favorite toggle button */}
            {available && (
              <button
                type="button"
                aria-label={fav ? "Hapus dari favorit" : "Tambah ke favorit"}
                onClick={(e) => {
                  e.preventDefault();
                  toggle(key);
                }}
                className="shrink-0 rounded p-0.5 transition-colors hover:bg-muted"
              >
                <Star
                  className={cn(
                    "h-4 w-4 transition-colors",
                    fav
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-muted-foreground hover:text-amber-400",
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
        {item.description}
      </p>
      {available ? (
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Segera Hadir
        </span>
      )}
    </div>
  );
}
