"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Clock,
  Download,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { featureKey, useFavorites } from "@/lib/hooks/use-favorites";
import type { DashboardItem, Department } from "@/lib/types";

type Props = {
  department: Department;
  item: DashboardItem;
  lastUpdated: string;
  /** URL export (mis. CSV). Tombol Export disembunyikan jika kosong. */
  exportHref?: string;
};

export function DashboardHeader({ department, item, lastUpdated, exportHref }: Props) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const { isFavorite, toggle } = useFavorites();
  const key = featureKey(department.slug, item.slug);
  const favorite = isFavorite(key);

  return (
    <div className="space-y-3">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/dashboard/${department.slug}`}
          className="hover:text-foreground"
        >
          {department.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{item.title}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => toggle(key)}
          >
            <Star
              className={
                favorite
                  ? "h-4 w-4 fill-amber-400 text-amber-400"
                  : "h-4 w-4"
              }
            />
            {favorite ? "Favorit" : "Tambah ke Favorit"}
          </Button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Terakhir Diperbarui</span>
            <span className="font-medium text-foreground">{lastUpdated}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={refreshing}
            onClick={() => startRefresh(() => router.refresh())}
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            Refresh
          </Button>
          {exportHref && (
            <a
              href={exportHref}
              className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Export
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
